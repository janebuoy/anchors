<template>
  <l-map
    ref="lmap"
    :zoom="baseLayer.zoom"
    :center="baseLayer.center"
    style="height: 100%"
  >
    <l-tile-layer
      ref="baseLayer"
      :url="baseLayer.url"
      :attribution="baseLayer.attribution"
    />
  </l-map>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";

export default {
  name: "LeafletMap",
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      baseLayer: {
        zoom: 10,
        center: latLng(61.174, 6.4586),
        url:
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        attribution: `
            &copy
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
            contributors &copy
            <a href="https://carto.com/attributions">CARTO</a>
            `,
      },
    };
  },
  mounted() {
    // Assign the Leaflet mapObject to map
    this.map = this.$refs.lmap.mapObject;
  },
};
</script>