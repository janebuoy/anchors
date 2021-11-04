<template>
  <l-control position="bottomright">
    <v-container fluid>
      <v-row>
        <div
          class="custom-control mr-2 pt-3 px-3"
          style="width: 325px; min-height: 50px"
          v-show="event !== null"
        >
          <h3 v-if="event !== null">{{ event[0] }}</h3>
          <div
            ref="eventContent"
            style="max-height: 150px; overflow: auto"
            v-chat-scroll
            class="pb-4"
          >
            <span v-if="event !== null" v-html="event[1]"></span>
          </div>
        </div>
      </v-row>
      <v-row>
        <div
          class="custom-control mr-2 pt-3"
          style="width: 325px; height: 50px; margin-top: 9px"
        >
          <v-row class="px-3">
            <v-slider
              v-model="actYear"
              :max="max"
              :min="min"
              hide-details
              class="align-center zIndexFix"
            >
              <template v-slot:append>
                <v-btn
                  icon
                  small
                  @click.stop="actYear--"
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
                <v-text-field
                  v-model="actYear"
                  class="mt-0 pt-0"
                  solo
                  flat
                  dense
                  hide-details
                  single-line
                  style="width: 54px"
                ></v-text-field>
                <v-btn
                  icon
                  small
                  @click.stop="actYear++"
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
                  </v-icon></v-btn
                >
                <v-menu top :close-on-click="closeOnClick">
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
          </v-row>
        </div>
      </v-row>
    </v-container>
  </l-control>
</template>

<script>
import { DomEvent } from "leaflet";

import { LControl } from "vue2-leaflet";
import { mapGetters } from "vuex";

import wtf from "wtf_wikipedia";

export default {
  name: "ColoniesSlider",
  props: ["min", "max", "eventsData"],
  components: {
    LControl,
  },
  data() {
    return {
      playing: false,
      speed: 600,
      event: null,
      tmpObj: null,
      interval: false,
      closeOnClick: true,
    };
  },
  computed: {
    ...mapGetters(["colSliderStart"]),
    actYear: {
      get() {
        return this.colSliderStart;
      },
      set(val) {
        this.$store.dispatch("colSliderStart", val);
      },
    },
  },
  methods: {
    increaseYear() {
      if (this.playing) {
        this.stopAnimation();
      }
      if (!this.interval) {
        this.interval = setInterval(() => this.actYear++, 120);
      }
    },
    decreaseYear() {
      if (this.playing) {
        this.stopAnimation();
      }
      if (!this.interval) {
        this.interval = setInterval(() => this.actYear--, 120);
      }
    },
    stopYear() {
      clearInterval(this.interval);
      this.interval = false;
    },
    getEvent(val) {
      let arr = [];
      for (let [key, value] of Object.entries(this.tmpObj)) {
        const keyStartTime = key.substring(0, 4);
        if (keyStartTime <= val && keyStartTime > this.min) {
          arr[0] = key;
          arr[1] = this.replaceWikiLinks(value.text);
          delete this.tmpObj[key];
          if (arr.length > 0) {
            this.event = arr;
          }
          const features = [
            {
              type: "Feature",
              properties: {
                year: arr[0],
                description: arr[1],
              },
              geometry: value.geometry,
            },
          ];
          this.$store.dispatch("colEventPoint", features);
        }
      }
    },
    replaceWikiLink(value) {
      const links = wtf(value).links();
      let text = [];
      let result = [];
      text[0] = wtf(value).text();
      if (links.length === 0) {
        return text[0];
      } else {
        for (let i = 0; i < links.length; i++) {
          if (links[i].data.text) {
            const URL =
              "<a href='https://en.wikipedia.org/wiki/" +
              links[i].data.page.split(" ").join("_") +
              "'>" +
              links[i].data.text +
              "</a>";
            text[i] = text[i].replace(links[i].data.text, URL);
            text[i + 1] = text[i].split("</a>").pop();
            result.push(text[i].split("</a>").shift() + "</a>");
            if (i == links.length - 1) {
              result.push(text.pop());
            }
          } else {
            const URL =
              "<a href='https://en.wikipedia.org/wiki/" +
              links[i].data.page.split(" ").join("_") +
              "'>" +
              links[i].data.page +
              "</a>";
            text[i] = text[i].replace(links[i].data.page, URL);
            text[i + 1] = text[i].split("</a>").pop();
            result.push(text[i].split("</a>").shift() + "</a>");
            if (i == links.length - 1) {
              result.push(text.pop());
            }
          }
        }
      }
      return result.join("");
    },
    replaceWikiLinks(value) {
      if (Array.isArray(value)) {
        let result = [];
        for (let i = 0; i < value.length; i++) {
          result.push(this.replaceWikiLink(value[i]));
        }
        return result.join("\n");
      } else {
        return this.replaceWikiLink(value);
      }
    },
    playAnimation(s) {
      if (this.playing || s === "begin") {
        this.playing = true;
        setTimeout(() => {
          if (this.actYear < this.max) {
            this.actYear++;
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
    actYear(val, old) {
      if (this.eventsData) {
        if (val <= old) {
          this.tmpObj = JSON.parse(JSON.stringify(this.eventsData));
          this.getEvent(val);
        }
        if (val > old) {
          this.getEvent(val);
        }
      }
    },
    eventsData(v) {
      if (v) {
        this.tmpObj = JSON.parse(JSON.stringify(v));
      }
    },
  },
  mounted() {
    // Enable Scrolling for the Event Box
    DomEvent.disableScrollPropagation(this.$refs.eventContent);
  },
};
</script>

<style>
.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot {
  padding: 0 7px !important;
}
</style>