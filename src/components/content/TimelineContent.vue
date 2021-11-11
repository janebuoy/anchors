<template>
  <v-card flat tile height="100%">
    <v-card-title style="word-break: normal !important">
      {{ currentItem.title }}
    </v-card-title>
    <v-card-subtitle>{{ currentItem.subtitle }}</v-card-subtitle>
    <v-card-text>
      <v-card color="grey lighten-4" rounded flat class="mx-1">
        <v-card-title
          class="headline"
          v-if="event !== null && event.properties"
        >
          {{ event.properties.name }}
        </v-card-title>
        <v-card-text
          v-if="event !== null && event.properties"
          class="event-links"
          v-html="event.properties.description"
        ></v-card-text>
        <v-divider v-if="event !== null && event.properties" />
        <v-card-actions>
          <v-slider
            v-model="year"
            :max="max"
            :min="min"
            hide-details
            class="align-center"
          >
            <template v-slot:append>
              <v-btn
                icon
                small
                @click.stop="year--"
                @mousedown="decreaseYear"
                @touchstart="decreaseYear"
                @mouseleave="stopYear"
                @mouseup="stopYear"
                @touchend="stopYear"
                class="align-self-center"
                title="Previous Year"
              >
                <v-icon> mdi-minus </v-icon></v-btn
              >
              <span class="align-self-center px-1">{{ year }}</span>
              <v-btn
                icon
                small
                @click.stop="year++"
                @mousedown="increaseYear"
                @touchstart="increaseYear"
                @mouseleave="stopYear"
                @mouseup="stopYear"
                @touchend="stopYear"
                class="align-self-center mr-1"
                title="Next Year"
              >
                <v-icon> mdi-plus </v-icon></v-btn
              >
            </template>
            <template v-slot:prepend>
              <v-btn
                icon
                @click.stop="toggleAnimation"
                :title="!playing ? 'Play Animation' : 'Pause Animation'"
              >
                <v-icon>
                  {{ !playing ? "mdi-play" : "mdi-pause" }}
                </v-icon>
              </v-btn>
              <v-menu top offset-y :close-on-click="closeOnClick">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="align-self-center"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                    title="Animation Speed"
                    ><v-icon> mdi-play-speed </v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item @click="speed = 1200">
                    <v-list-item-title>0.5x</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="speed = 600">
                    <v-list-item-title>1x</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="speed = 300">
                    <v-list-item-title>2x</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-slider>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TimelineContent",
  data() {
    return {
      min: 1400,
      max: new Date().getFullYear(),
      playing: false,
      speed: 600,
      event: null,
      closeOnClick: true,
    };
  },
  computed: {
    ...mapGetters([
      "colSliderStart",
      "timeline",
      "currentItem",
      "tabItemsHeight",
    ]),
    year: {
      get() {
        return this.colSliderStart;
      },
      set(val) {
        this.$store.dispatch("colSliderStart", val);
      },
    },
    reverseTimeline() {
      return [...this.timeline].reverse();
    },
  },
  methods: {
    increaseYear() {
      if (this.playing) {
        this.stopAnimation();
      }
      if (!this.interval) {
        this.interval = setInterval(() => this.year++, 120);
      }
    },
    decreaseYear() {
      if (this.playing) {
        this.stopAnimation();
      }
      if (!this.interval) {
        this.interval = setInterval(() => this.year--, 120);
      }
    },
    stopYear() {
      clearInterval(this.interval);
      this.interval = false;
    },
    getEvent(val) {
      if (this.timeline.find((e) => e.properties.name.includes(val))) {
        this.event = this.timeline.find((e) => e.properties.name.includes(val));
        this.$store.dispatch("colEventPoint", [this.event]);
      } else {
        this.event = this.reverseTimeline.find(
          (e) => e.properties.start <= val
        );
      }
    },
    playAnimation(s) {
      if (this.playing || s === "begin") {
        this.playing = true;
        setTimeout(() => {
          if (this.year < this.max) {
            this.year++;
            this.playAnimation();
          } else {
            this.playing = false;
            return;
          }
        }, this.speed);
      }
    },
    stopAnimation() {
      this.playing = false;
    },
    toggleAnimation() {
      if (this.playing) {
        this.stopAnimation();
      } else {
        this.playAnimation("begin");
      }
    },
  },
  watch: {
    year(val, old) {
      if (this.timeline) {
        if (val <= old) {
          this.getEvent(val);
        }
        if (val > old) {
          this.getEvent(val);
        }
        if (val === this.max) {
          this.$store.dispatch("addCompleted", this.currentItem.id);
        }
      }
    },
  },
};
</script>