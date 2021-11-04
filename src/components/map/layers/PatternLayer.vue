<template>
  <l-geo-json :geojson="geojson" :options="optionsExhib" />
</template>

<script>
import L from "leaflet";
import "leaflet.pattern";

import { LGeoJson } from "vue2-leaflet";

export default {
  name: "PatternLayer",
  components: {
    LGeoJson,
  },
  props: ["geojson"],
  computed: {
    uniqueColors() {
      if (this.geojson) {
        const colorNames = [
          ...new Set(this.geojson.features.map((a) => a.meta.color.name)),
        ];
        const colorValues = [
          ...new Set(this.geojson.features.map((a) => a.meta.color.hex)),
        ];
        let uniqueColors = [];
        for (let i = 0; i < colorNames.length; i++) {
          uniqueColors[i] = { name: colorNames[i], hex: colorValues[i] };
        }
        return uniqueColors;
      } else {
        return undefined;
      }
    },
    patterns() {
      let result = {};
      for (let i = 0; i < this.uniqueColors.length; i++) {
        const vm = this;
        const pattern = new L.StripePattern({
          color: vm.uniqueColors[i].hex,
          opacity: 1,
          angle: -10,
        });
        result[this.uniqueColors[i].name] = pattern;
      }
      return result;
    },
    optionsExhib() {
      return {
        onEachFeature: this.onEachFeatureExhib,
        style: this.styleExhib,
      };
    },
    onEachFeatureExhib() {
      return (feature, layer) => {
        layer.on("click", (e) => {
          L.popup()
            .setLatLng(e.latlng)
            .setContent(
              "<p class='popup_title'>" + feature.properties.name + "</p>"
            )
            .openOn(this.map);
        });
      };
    },
    styleExhib() {
      return (feature) => {
        const style = {
          fillPattern: this.patterns[feature.meta.color.name],
          color: "gray",
          fillOpacity: 0.8,
          weight: 1,
          smoothFactor: 1,
        };
        return style;
      };
    },
  },
  created() {
    this.map = this.$parent.$parent.$refs.lmap.mapObject;
  },
  mounted() {
    // Add patterns to map Object
    for (let value of Object.values(this.patterns)) {
      value.addTo(this.map);
    }
  },
  beforeDestroy() {
    // Remove patterns to map Object
    for (let value of Object.values(this.patterns)) {
      this.map.removeLayer(value);
    }
  },
};
</script>

<style>
.popup_title {
  margin: 8px 0 !important;
  font-size: 0.875rem;
}

.popup_subtitle {
  margin-top: 8px !important;
  margin-bottom: 16px !important;
  font-size: 0.875rem;
}

.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  font-weight: 400 !important;
  line-height: 1.4 !important;
  border-radius: 0 !important;
}
</style>