<template>
  <l-layer-group v-if="this.colonies">
    <l-geo-json
      v-if="colEventPoint"
      :geojson="makeFeatureCollection(colEventPoint)"
      :options="colEventPointOptions"
    />
    <l-geo-json
      v-for="(value, name) in colonies"
      :geojson="value"
      :key="name"
      :options="optionsColonies"
      :options-style="coloniesStyles[name]"
    />
  </l-layer-group>
</template>
<script>
import L from "leaflet";
import { LLayerGroup, LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";
export default {
  name: "ColoniesLayer",
  components: {
    LLayerGroup,
    LGeoJson,
  },
  props: ["geojson", "max"],
  data() {
    return {
      empires: [
        "britain",
        "france",
        "belgium",
        "netherlands",
        "germany",
        "portugal",
        "spain",
        "italy",
      ],
      coloniesColors: [
        "red",
        "cornflowerblue",
        "black",
        "orange",
        "black",
        "maroon",
        "sienna",
        "darkslategray",
      ],
    };
  },
  computed: {
    ...mapGetters(["colors", "colSliderStart", "colEventPoint"]),
    colEventPointOptions() {
      return {
        // onEachFeature: this.onEachFeatureCotton,
        pointToLayer: this.pointToLayer,
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
    colonies() {
      const colonies = {};
      for (let i = 0; i < this.empires.length; i++) {
        const result = this.geojson.features
          .filter((a) => a.col)
          .filter((a) => a.col[this.empires[i]])
          .filter(
            (a) =>
              a.col[this.empires[i]].start_mean !== null &&
              a.col[this.empires[i]].start_mean < this.colSliderStart &&
              a.col[this.empires[i]].start_mean <
                this.colSliderStart + (this.max - this.colSliderStart) &&
              a.col[this.empires[i]].end_mean > this.colSliderStart
          );
        colonies[this.empires[i]] = this.makeFeatureCollection(result);
      }
      return colonies;
    },
    optionsColonies() {
      return {
        onEachFeature: this.onEachFeature,
      };
    },
    onEachFeature() {
      return (feature, layer) => {
        layer.on("click", (e) => {
          L.popup()
            .setLatLng(e.latlng)
            .setContent(this.printInfo(feature))
            .openOn(this.map);
        });
      };
    },
    coloniesStyles() {
      const fillColor = this.fillColor; // important! need touch fillColor in computed to re-calculate when change fillColor
      const styles = {};
      for (let i = 0; i < this.empires.length; i++) {
        styles[this.empires[i]] = {
          weight: 1,
          color: this.coloniesColors[i],
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 0.3,
        };
      }
      return styles;
    },
  },
  methods: {
    makeFeatureCollection(array) {
      const obj = new Object({
        features: array,
        type: "FeatureCollection",
      });
      return obj;
    },
    printInfo(feature) {
      const info = [];
      let lastStart = null;
      for (let [key, value] of Object.entries(feature.col)) {
        if (value.start_mean) {
          const line =
            key.charAt(0).toUpperCase() +
            key.slice(1) +
            ": " +
            value.start_mean +
            "-" +
            value.end_mean;
          if (value.start_mean < lastStart) {
            info.unshift("<p class='popup_content'>" + line + "</p>\n");
          } else {
            info.push("<p class='popup_content'>" + line + "</p>\n");
          }
          lastStart = value.start_mean;
        }
      }
      return (
        "<p class='popup_title'>" +
        feature.properties.name +
        "</p>\n" +
        info.join("")
      );
    },
  },
  created() {
    this.map = this.$parent.$parent.$refs.lmap.mapObject;
  },
};
</script>