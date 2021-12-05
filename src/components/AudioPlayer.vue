<template>
  <div>
    <v-toolbar
      bottom
      dark
      dense
      color="primary darken-1"
      flat
      style="position: relative; z-index: 300"
    >
      <v-icon v-if="$vuetify.breakpoint.smAndDown">
        {{ contentDrawer ? "mdi-chevron-down" : "mdi-chevron-up" }}
      </v-icon>
      <v-row
        class="d-flex align-center justify-center"
        :class="$vuetify.breakpoint.smAndDown ? 'ml-n6' : null"
        no-gutters
      >
        <v-btn
          icon
          @click.stop="prevAudio()"
          :title="config.player.prevAudio"
          :disabled="prevAudioID === false || !localSrc"
        >
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn
          icon
          class="mr-1"
          @click.stop="seekBackwards()"
          :title="config.player.seekBackwards"
          :disabled="!localSrc"
        >
          <v-icon>mdi-replay</v-icon>
        </v-btn>
        <v-btn
          fab
          large
          color="secondary"
          class="mt-n2"
          @click.stop="toggleAudio()"
          :title="!isPlaying ? config.player.play : config.player.pause"
          ref="playButton"
          :disabled="!localSrc"
          style="position: relative; z-index: 400"
        >
          <v-icon large class="white--text" v-if="!isPlaying">mdi-play</v-icon>
          <v-icon v-else large class="white--text">mdi-pause</v-icon>
        </v-btn>
        <v-btn
          icon
          @click.stop="seekForwards()"
          :title="config.player.seekForwards"
          class="ml-1"
          :disabled="!localSrc"
        >
          <v-icon class="mirror">mdi-replay</v-icon>
        </v-btn>
        <v-btn
          icon
          @click.stop="nextAudio()"
          :title="config.player.nextAudio"
          :disabled="nextAudioID === false || !localSrc"
        >
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
    <v-toolbar
      dark
      dense
      color="primary darken-1"
      style="position: relative; z-index: 200"
      flat
    >
      <v-row
        class="d-flex align-center justify-center mt-0 pb-2 px-2"
        no-gutters
      >
        <v-slider
          title="Seek"
          v-model="computedProgress"
          @mousedown="pauseProgress"
          @click.stop="jumpInTime"
          @
          min="0"
          max="100"
          step="0.01"
          class="pl-4 pr-4 mb-n6 ml-n3"
          style="max-width: 500px"
          color="primary"
          track-color="grey lighten-2"
          track-fill-color="secondary lighten-1"
          thumb-color="secondary lighten-1"
          :label="elaspedTime"
          :disabled="!localSrc"
        />
        <p
          class="mb-n2 ml-n2 v-label theme--dark"
          :class="!localSrc ? 'v-label--is-disabled' : null"
          style="margin-top: -5px"
        >
          {{ minutes }}:{{ seconds }}
        </p>
      </v-row>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";
import { config } from "../../config.js";

export default {
  name: "AudioPlayer",
  data() {
    return {
      config: config,
      localSrc: null,
      localProgress: null,
      duration: 0,
      progress: 0,
      currentTime: 0,
      lastAudioID: null,
      addCompletedSent: false,
    };
  },
  computed: {
    ...mapGetters([
      "isPlaying",
      "nextAudioID",
      "prevAudioID",
      "currentItem",
      "currentUUID",
      "audios",
      "currentAudioID",
      "contentDrawer",
    ]),

    windowWidth() {
      return this.$vuetify.breakpoint.width;
    },
    elapsedMinutes() {
      let mins = Math.floor(this.currentTime / 60);
      if (mins < 10) {
        mins = 0 + String(mins);
      }
      return mins;
    },
    elapsedSeconds() {
      let secs = Math.floor(this.currentTime % 60);
      if (secs < 10) {
        secs = 0 + String(secs);
      }
      return secs;
    },
    elaspedTime() {
      return String(this.elapsedMinutes) + ":" + String(this.elapsedSeconds);
    },
    minutes() {
      let mins = Math.floor((this.duration - this.currentTime) / 60);
      if (mins < 10 && mins > 0) {
        mins = 0 + String(mins);
      } else if (mins === 0) {
        mins = "00";
      }
      return mins;
    },
    seconds() {
      let secs = Math.floor((this.duration - this.currentTime) % 60);
      if (secs < 10 && secs > 0) {
        secs = 0 + String(secs);
      } else if (secs < 60 && secs > 0) {
        secs = String(secs);
      } else {
        secs = "00";
      }
      return secs;
    },
    computedProgress: {
      get: function () {
        return this.progress;
      },
      set: function (value) {
        this.localProgress = value;
      },
    },
  },
  methods: {
    toggleAudio() {
      // If nothing is playing, load Audio of selected item and play
      if (!this.isPlaying && this.currentItem.type === "audio") {
        this.loadAudio();
        this.playAudio();
        eventBus.$emit("updateTab", this.currentItem.id);
        // If something is playing and selected item is different, load that item's source
      } else if (
        this.isPlaying &&
        this.localSrc !== this.currentItem.src &&
        this.currentItem.type === "audio"
      ) {
        this.loadAudio();
        this.playAudio();
        // If selected item is already playing, pause
      } else if (
        this.localSrc === this.currentItem.src &&
        this.currentItem.type === "audio"
      ) {
        this.pauseAudio();
      } else if (this.isPlaying && this.currentItem.type !== "audio") {
        this.pauseAudio();
      } else if (!this.isPlaying && this.currentItem.type !== "audio") {
        this.playAudio();
      }
    },
    playAudio() {
      const newTime = ((this.localProgress * 1000) / 100000) * this.duration;
      window.player.currentTime = newTime;
      window.player.play();
      this.startTimer(0);
      const payload = {
        id: this.lastAudioID,
        currentTime: this.currentTime,
        duration: this.duration,
        progress: this.progress,
        localSrc: this.localSrc,
        isPlaying: true,
      };
      this.$store.dispatch("saveAudioState", payload);
      this.$store.dispatch("updatePlayingState", true);
    },
    pauseAudio() {
      window.player.pause();
      clearTimeout(this.timer);
      const payload = {
        id: this.lastAudioID,
        currentTime: this.currentTime,
        duration: this.duration,
        progress: this.progress,
        localSrc: this.localSrc,
        isPlaying: false,
      };
      this.$store.dispatch("saveAudioState", payload);
      this.$store.dispatch("updatePlayingState", false);
    },
    pauseProgress() {
      clearTimeout(this.timer);
    },
    jumpInTime() {
      const newTime = ((this.localProgress * 1000) / 100000) * this.duration;
      window.player.currentTime = newTime;
      this.startTimer(0);
    },
    seekForwards() {
      window.player.currentTime += 10;
    },
    seekBackwards() {
      window.player.currentTime -= 10;
    },
    prevAudio() {
      eventBus.$emit("prevAudio");
    },
    nextAudio() {
      eventBus.$emit("nextAudio");
    },
    startTimer(delay) {
      const vm = this;
      vm.timer = setTimeout(function () {
        vm.currentTime = window.player.currentTime;
        vm.progress =
          Math.round((vm.currentTime / vm.duration) * 100000) / 1000;
        if (vm.progress <= 100 || isNaN(vm.progress)) {
          vm.startTimer(100);
        }
      }, delay);
    },
    resetAudio() {
      this.pauseAudio();
      this.localSrc = "";
      this.progress = 0;
      this.duration = 0;
      this.currentTime = 0;
      this.localProgress = 0;
      window.player = null;
    },
    loadAudio() {
      // Load source if local source is different from currentItem source
      if (this.localSrc !== this.currentItem.src) {
        // reset player if exists
        if (window.player !== null) {
          this.resetAudio();
          this.getAudioState();
        }
        // store last audio id as safety measure against async state updates
        this.lastAudioID = this.currentItem.id;
        // assign new source from from currentItem source
        this.localSrc = this.currentItem.src;

        // assign a new player to windiw.player and attach the local source
        window.player = new Audio();
        window.player.preload = true;
        window.player.src = this.localSrc;

        let vm = this;
        window.player.addEventListener("loadedmetadata", function () {
          vm.duration = Math.round(this.duration);
        });
        window.player.addEventListener("ended", this.resetAudio);
      }
    },
    getAudioState() {
      if (this.audios[this.currentUUID][this.currentItem.id]) {
        this.currentTime =
          this.audios[this.currentUUID][this.currentItem.id].currentTime;
        this.duration =
          this.audios[this.currentUUID][this.currentItem.id].duration;
        this.progress =
          this.audios[this.currentUUID][this.currentItem.id].progress;
        this.localProgress =
          this.audios[this.currentUUID][this.currentItem.id].progress;
      }
    },
  },
  created() {
    eventBus.$on("toggleAudio", this.toggleAudio);
  },
  mounted() {
    this.getAudioState();
    if (this.isPlaying) {
      this.startTimer(0);
    }
    this.loadAudio();
  },
  beforeDestroy() {
    const payload = {
      id: this.lastAudioID,
      currentTime: this.currentTime,
      duration: this.duration,
      progress: this.progress,
      localSrc: this.localSrc,
      isPlaying: this.isPlaying,
    };
    this.$store.dispatch("saveAudioState", payload);
  },
  watch: {
    currentUUID() {
      this.getAudioState();
      this.loadAudio();
    },
    currentItem(v) {
      if (v.type === "audio") {
        //this.getAudioState();
        this.loadAudio();
      }
    },
    localProgress(v) {
      if (v > 99 && !this.addCompletedSent) {
        this.$store.dispatch("addCompleted", this.currentAudioID);
        this.addCompletedSent = true;
      }
      if (v === 0) {
        this.addCompletedSent = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mirror {
  transform: scale(-1, 1);
}
</style>