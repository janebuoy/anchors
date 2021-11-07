<template>
  <l-geo-json :geojson="geojson" :options="options" />
</template>

<script>
import L from "leaflet";
import { LGeoJson } from "vue2-leaflet";

export default {
  name: "PointsLayer",
  props: ["geojson"],
  components: { LGeoJson },
  computed: {
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
  created() {
    console.log(this.geojson);
  },
};
</script>