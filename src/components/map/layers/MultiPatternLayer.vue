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
import L from "leaflet";
import "leaflet.pattern";
import { LLayerGroup, LGeoJson } from "vue2-leaflet";
import { eventBus } from "@/main";

export default {
  name: "MultiPatternLayer",
  components: {
    LLayerGroup,
    LGeoJson,
  },
  props: ["data"],
  data() {
    return {
      active: 0,
      colors: [
        {
          name: "indigo lighten-2",
          hex: "#7986CB",
        },
      ],
    };
  },
  computed: {
    activeFeatures() {
      const features = this.data.features.filter(
        (e) => e.properties.categoryID === this.active
      );
      return { features };
    },
    uniqueColors() {
      let colors = [];
      for (const feature of this.data.features) {
        colors.push({
          color: feature.meta.color,
        });
      }
      const unique = [...new Set(colors.map(JSON.stringify))].map(JSON.parse);
      return unique;
    },
    patterns() {
      let result = {};
      for (let color of this.uniqueColors) {
        const pattern = new L.StripePattern({
          color: color.color.hex,
          opacity: 1,
          angle: -10,
        });
        result[color.color.hex] = pattern;
      }
      return result;
    },
    options() {
      return {
        onEachFeature: this.onEachFeature,
        style: this.style,
      };
    },
    onEachFeature() {
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
    style() {
      return (feature) => {
        const style = {
          fillPattern: this.patterns[feature.meta.color.hex],
          color: "gray",
          fillOpacity: 0.8,
          weight: 1,
          smoothFactor: 1,
        };
        return style;
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
