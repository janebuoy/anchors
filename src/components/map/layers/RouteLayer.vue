<template>
  <l-geo-json :geojson="geojson" :options-style="styleRoute" />
</template>

<script>
import { LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";

export default {
  name: "RouteLayer",
  components: {
    LGeoJson,
  },
  props: ["geojson"],
  computed: {
    ...mapGetters(["colors"]),
    styleRoute() {
      // ! need touch fillColor in computed to re-calculate when change fillColor
      // const fillColor = this.fillColor;
      return {
        color: this.colors.primary.base,
        weight: 3,
        opacity: 0.7,
        stroke: true,
        lineCap: "round",
        dashArray: "0.7 6",
      };
    },
  },
};
</script>