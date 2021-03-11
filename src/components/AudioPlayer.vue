<template>
  <v-card tile dark elevation="6" color="primary" style="z-index: 200">
    <v-row class="d-flex align-center justify-center" no-gutters>
      <v-btn
        icon
        @click.stop="prevAudio()"
        :disabled="prevAudioID === false || !localSrc"
      >
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn
        icon
        class="mr-1"
        @click.stop="seekBackwards()"
        :disabled="!localSrc"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
      <v-btn
        fab
        color="accent"
        class="mt-n2"
        @click.stop="toggleAudio()"
        ref="playButton"
      >
        <v-icon large class="white--text" v-if="!isPlaying">mdi-play</v-icon>
        <v-icon v-else large class="white--text">mdi-pause</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="seekForwards()"
        class="ml-1"
        :disabled="!localSrc"
      >
        <v-icon class="mirror">mdi-replay</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="nextAudio()"
        :disabled="nextAudioID === false || !localSrc"
      >
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-row>
    <v-row class="d-flex align-center justify-center mt-0 pb-2 px-2" no-gutters>
      <v-slider
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
        track-fill-color="accent lighten-1"
        thumb-color="accent lighten-1"
        :label="elaspedTime"
      />
      <p
        class="mb-n2 ml-n2"
        :class="[localSrc ? 'duration-label' : null]"
        style="margin-top: -5px"
      >
        {{ minutes }}:{{ seconds }}
      </p>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";

export default {
  name: "AudioPlayer",
  data() {
    return {
      localSrc: null,
      localProgress: null,
      duration: 0,
      progress: 0,
      currentTime: 0,
    };
  },
  computed: {
    ...mapGetters([
      "isPlaying",
      "nextAudioID",
      "prevAudioID",
      "currentItem",
      "savedAudioState",
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
      if (!this.isPlaying) {
        this.loadAudio();
        this.playAudio();
        // If something is playing and selected item is different, load that item's source
      } else if (this.isPlaying && this.localSrc !== this.currentItem.src) {
        this.loadAudio();
        this.playAudio();
        // If selected item is already playing, pause
      } else if (this.localSrc === this.currentItem.src) {
        this.pauseAudio();
      }
    },
    playAudio() {
      window.player.play();
      this.startTimer(0);
      this.$store.dispatch("updatePlayingState", true);
    },
    pauseAudio() {
      window.player.pause();
      clearTimeout(this.timer);
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
      window.player = null;
    },
    loadAudio() {
      // Load source if local source is different from currentItem source
      if (this.localSrc !== this.currentItem.src) {
        // reset player if exists
        if (window.player !== null) {
          this.resetAudio();
        }
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
      }
    },
  },
  created() {
    eventBus.$on("toggleAudio", this.toggleAudio);
  },
  mounted() {
    this.currentTime = this.savedAudioState.currentTime;
    this.duration = this.savedAudioState.duration;
    this.progress = this.savedAudioState.progress;
    this.localSrc = this.savedAudioState.localSrc;
    if (this.isPlaying) {
      this.startTimer(0);
    }
  },
  beforeDestroy() {
    const payload = {
      currentTime: this.currentTime,
      duration: this.duration,
      progress: this.progress,
      localSrc: this.localSrc,
      isPlaying: this.isPlaying,
    };
    this.$store.dispatch("saveAudioState", payload);
  },
  watch: {
    currentItem() {
      this.loadAudio();
      // Set focus to play button
      // this.$refs.playButton.$el.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.disabledSliderLabel {
  color: rgba(224, 224, 224, 0.28) !important;
}
.duration-label {
  color: #e0e0e0 !important;
}
.mirror {
  transform: scale(-1, 1);
}
>>> .theme--dark.v-label {
  color: #e0e0e0 !important;
}
>>> .theme--dark.v-label--is-disabled {
  color: rgba(224, 224, 224, 0.28) !important;
}
</style>