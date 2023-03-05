<template>
  <l-geo-json
    v-if="waterLevels"
    :geojson="waterLevels"
    :options="optionsWaterLevel"
  />
</template>

<script>
import L from "leaflet";

import { LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";
import { eventBus } from "@/main";

export default {
  name: "WaterLevelsLayer",
  components: {
    LGeoJson,
  },
  computed: {
    ...mapGetters(["waterLevels"]),
    optionsWaterLevel() {
      return {
        onEachFeature: this.onEachFeatureWaterLevel,
        pointToLayer: this.pointToLayer,
      };
    },
    onEachFeatureWaterLevel() {
      return (feature, layer) => {
        layer.bindPopup(
          "<p class='popup_title'>" +
            feature.properties.name +
            "</p><p class='popup_subtitle'>"
        );

        layer.on({
          click: function () {
            // this.openPopup();
            const payload = {
              geometry: feature.geometry,
              properties: {
                zoom: 12,
              },
              type: feature.type,
            };
            eventBus.$emit("setCoords", payload);
            eventBus.$emit("updateChart", feature.properties);
          },
        });
      };
    },
    pointToLayer() {
      return (_, latlng) => {
        const style = {
          radius: 12,
          fillColor: this.$vuetify.theme.themes.light.tertiary.lighten3,
          color: this.$vuetify.theme.themes.light.tertiary.base,
          fillOpacity: 0.8,
          opacity: 1,
          weight: 1,
        };
        return L.circleMarker(latlng, style);
      };
    },
  },
  created() {
    this.$store.dispatch("fetchWeserWaterLevels");
  },
};
</script>