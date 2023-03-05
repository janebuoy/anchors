<template>
  <l-control position="bottomright">
    <v-container fluid>
      <v-row class="align-center">
        <div
          v-if="show"
          class="custom-control mr-2 pt-3"
          style="width: 300px; height: 36px"
        >
          <v-row class="px-3">
            <v-slider
              :value="opacity"
              min="0"
              max="100"
              hide-details
              track-color="grey-lighten-1"
              track-fill-color="secondary lighten-1"
              thumb-color="secondary lighten-1"
              @input="changeOpacity"
              title="Change Opacity"
            ></v-slider>
          </v-row>
        </div>
        <v-btn
          :fab="$vuetify.breakpoint.smAndDown"
          @click.stop="toggleSlider"
          :title="show ? 'Close Control Opacity' : 'Open Control Opacity'"
        >
          <v-icon
            :left="!$vuetify.breakpoint.smAndDown"
            :small="!$vuetify.breakpoint.smAndDown"
            >mdi-contrast</v-icon
          >
          {{ !$vuetify.breakpoint.smAndDown ? "Control Opacity" : null }}
        </v-btn>
      </v-row>
    </v-container>
  </l-control>
</template>

<script>
import { eventBus } from "@/main";
import { LControl } from "vue2-leaflet";
export default {
  name: "OpacitySlider",
  components: {
    LControl,
  },
  data() {
    return {
      opacity: 60, // Be equal to RiverCorrectionLayer options.sliderValue
      show: false,
    };
  },
  methods: {
    toggleSlider() {
      this.show = !this.show;
    },
    changeOpacity(v) {
      eventBus.$emit("changeOpacity", v);
    },
  },
};
</script>