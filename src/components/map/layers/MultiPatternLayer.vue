<template>
  <l-layer-group>
    <l-geo-json
      v-for="(feature, key) in activeFeatures"
      :key="key"
      :geojson="feature"
      :options="optionsExhib"
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
  props: ["geojson"],
  computed: {
    activeFeatures() {
      const features = this.geojson.features.filter(
        (e) => e.properties.categoryID === this.active
      );
      return { features };
    },
    patterns() {
      let result = {};
      for (let i = 0; i < this.colors.length; i++) {
        const vm = this;
        const pattern = new L.StripePattern({
          color: vm.colors[i].hex,
          opacity: 1,
          angle: -10,
        });
        result[this.colors[i].name] = pattern;
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
