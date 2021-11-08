<template>
  <l-layer-group>
    <l-geo-json
      v-for="(feature, key) in activeFeatures"
      :key="key"
      :geojson="feature"
      :options="options"
    />
  </l-layer-group>
</template>

<script>
import { eventBus } from "@/main";

import L from "leaflet";
import { LGeoJson, LLayerGroup } from "vue2-leaflet";

export default {
  name: "PointsLayer",
  props: ["geojson"],
  components: { LGeoJson, LLayerGroup },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    activeFeatures() {
      const features = this.geojson.features.filter(
        (e) => e.properties.categoryID === this.active
      );
      return { features };
    },
    options() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
      };
    },
    onEachFeature() {
      return (feature, layer) => {
        layer.bindPopup(
          "<p class='popup_title'>" +
            feature.properties.name +
            "</p><p class='popup_subtitle'>" +
            feature.properties.description +
            "</p>"
        );
        layer.on({
          click: function () {
            this.openPopup();
          },
        });
      };
    },
    pointToLayer() {
      return (_, latlng) => {
        const style = {
          radius: 12,
          fillColor: this.$vuetify.theme.themes.light.secondary.lighten3,
          color: this.$vuetify.theme.themes.light.secondary.base,
          fillOpacity: 0.8,
          opacity: 1,
          weight: 1,
        };
        return L.circleMarker(latlng, style);
      };
    },
  },
  methods: {
    switchLayer(v) {
      this.active = v;
    },
  },
  created() {
    eventBus.$on("switchLayer", this.switchLayer);
  },
};
</script>