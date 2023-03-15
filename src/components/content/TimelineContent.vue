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
        >{{ event.properties.description }}</v-card-text>
        <v-divider v-if="event !== null && event.properties" />
        <v-card-actions>
          <v-slider
            v-if="timeline"
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
                :title="
                  !playing
                    ? year == max
                      ? 'Restart Animation'
                      : 'Play Animation'
                    : 'Pause Animation'
                "
              >
                <v-icon>
                  {{
                    !playing
                      ? year == max
                        ? "mdi-restart"
                        : "mdi-play"
                      : "mdi-pause"
                  }}
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
import axios from "axios";
import { replaceWikiLinks } from "@/plugins/renderWikiText.js";

export default {
  name: "TimelineContent",
  data() {
    return {
      playing: false,
      speed: 600,
      event: null,
      closeOnClick: true,
      timeline: null,
    };
  },
  computed: {
    ...mapGetters(["colSliderStart", "currentItem", "tabItemsHeight"]),
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
    min() {
      return this.timeline[0].properties.start;
    },
    max() {
      return this.reverseTimeline[0].properties.start;
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
        if (this.year == this.max) {
          this.year = this.min;
          this.playAnimation("begin");
        } else {
          this.playAnimation("begin");
        }
      }
    },
  },
  created() {
    axios.get(this.currentItem.src).then((response) => {
      const resp = response.data;
      let timelineArr = [];
      for (let [key, value] of Object.entries(resp)) {
        timelineArr.push({
          type: "Feature",
          properties: {
            name: key,
            start: key.slice(0, 4),
            description: replaceWikiLinks(value.text),
          },
          geometry: value.geometry,
        });
      }
      this.timeline = timelineArr;
      this.year = this.min;
    });
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