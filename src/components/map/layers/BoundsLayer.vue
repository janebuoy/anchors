<template>
  <l-geo-json :geojson="geojson" :options="optionsStopBounds" />
</template>

<script>
import L from "leaflet";
import { LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";
import { eventBus } from "../../../main";

export default {
  name: "BoundsLayer",
  components: {
    LGeoJson,
  },
  props: ["geojson"],
  computed: {
    ...mapGetters(["actionBoundsRadius", "colors"]),
    optionsStopBounds() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayerStopBounds,
      };
    },
    onEachFeature() {
      return (_, layer) => {
        layer.on({
          click: this.onStopClick,
        });
      };
    },
    pointToLayerStopBounds() {
      return (_, latlng) => {
        const style = {
          radius: this.actionBoundsRadius,
          fillColor: this.colors.primary.lighten3,
          color: this.colors.primary.darken3,
          fillOpacity: 0.2,
          opacity: 0.1,
          weight: 1,
        };
        return L.circle(latlng, style);
      };
    },
  },
  methods: {
    onStopClick(item) {
      if (item.target.feature.uuid !== this.currentUUID) {
        eventBus.$emit("openScene", item.target.feature.uuid);
      }
    },
  },
};
</script>