<template>
  <l-geo-json :geojson="streets" :options="optionsStreets" />
</template>

<script>
import L from "leaflet";
import { LGeoJson } from "vue2-leaflet";

export default {
  name: "streetsLayer",
  props: ["streets"],
  components: { LGeoJson },
  computed: {
    optionsStreets() {
      return {
        onEachFeature: this.onEachFeatureStreets,
        pointToLayer: this.pointToLayer,
      };
    },
    onEachFeatureStreets() {
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
          radius: 8,
          fillColor: "red",
          color: "red",
          fillOpacity: 0.5,
          opacity: 1,
          weight: 1,
        };
        return L.circleMarker(latlng, style);
      };
    },
  },
};
</script>