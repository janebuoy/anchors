<template>
  <l-tile-layer ref="RasterLayer" :url="data" :options="options" />
</template>

<script>
import { LTileLayer } from "vue2-leaflet";
import { eventBus } from "@/main";

export default {
  name: "RasterLayer",
  components: {
    LTileLayer,
  },
  props: ["data"],
  data() {
    return {
      options: {
        opacity: 0.6, // default
      },
    };
  },
  methods: {
    changeOpacity(v) {
      this.$refs.RasterLayer.mapObject.setOpacity(v / 100);
    },
  },
  created() {
    eventBus.$on("changeOpacity", this.changeOpacity);
  },
};
</script>