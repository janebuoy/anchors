<template>
  <l-tile-layer ref="RiverCorrectionLayer" :url="url" :options="options" />
</template>

<script>
import { LTileLayer } from "vue2-leaflet";
import { eventBus } from "../../../main";

export default {
  name: "RiverCorrectionLayer",
  components: {
    LTileLayer,
  },
  data() {
    return {
      url: "/data/tiles/{z}/{x}/{-y}.png",
      options: {
        opacity: 0.6, // default
      },
    };
  },
  methods: {
    changeOpacity(v) {
      this.$refs.RiverCorrectionLayer.mapObject.setOpacity(v / 100);
    },
  },
  created() {
    eventBus.$on("changeOpacity", this.changeOpacity);
  },
};
</script>