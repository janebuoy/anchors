<template>
  <l-layer-group>
    <l-geo-json
      v-if="active === 0"
      :geojson="cottonBremen"
      :options="optionsCotton"
    />
    <l-geo-json
      v-if="active === 1"
      :geojson="cottonWorld"
      :options="optionsCotton"
    />
  </l-layer-group>
</template>

<script>
import L from "leaflet";
import { LLayerGroup, LGeoJson } from "vue2-leaflet";
import { eventBus } from "../../../main";

export default {
  name: "CottonLayer",
  props: ["cottonBremen", "cottonWorld"],
  components: {
    LLayerGroup,
    LGeoJson,
  },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    optionsCotton() {
      return {
        onEachFeature: this.onEachFeatureCotton,
        pointToLayer: this.pointToLayer,
      };
    },
    onEachFeatureCotton() {
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