<template>
  <l-geo-json
    :geojson="geojson"
    :options="optionsScenes"
    :key="'scenes' + stopKeyIndex"
  />
</template>

<script>
import L from "leaflet";
import { icon } from "leaflet";

import { LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";
import { eventBus } from "@/main";
export default {
  name: "StopsLayer",
  components: {
    LGeoJson,
  },
  props: ["geojson"],
  data() {
    return {
      markerIconColors: [],
      stopKeyIndex: 0,
      prevID: null,
    };
  },
  computed: {
    ...mapGetters(["currentUUID", "markerIcons", "colors"]),
    optionsScenes() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayerScenes,
      };
    },
    onEachFeature() {
      return (_, layer) => {
        layer.on({
          click: this.onStopClick,
        });
      };
    },
    pointToLayerScenes() {
      return (feature, latlng) => {
        const points = this.geojson.features;
        // Match scenes IDs with ID of given feature
        const index = points.findIndex((a) => a.uuid === feature.uuid) + 1;
        const svg =
          "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g><path d='" +
          this.markerIcons.fg[index] +
          "' fill='" +
          this.markerIconColors[index] +
          "' fill-opacity='1' stroke='#6B818C' stroke-opacity='0.5' stroke-width='.5'/><path d='" +
          this.markerIcons.bg[index] +
          "' fill='#FFFFFF' stroke-width='.028606'/></g></svg>";
        const url = "data:image/svg+xml," + encodeURIComponent(svg);
        const markerIcon = icon({
          iconUrl: url,
          iconSize: [32, 37],
          iconAnchor: [16, 18],
        });
        return new L.Marker(latlng, { icon: markerIcon });
      };
    },
  },
  methods: {
    onStopClick(item) {
      if (item.target.feature.uuid !== this.currentUUID) {
        eventBus.$emit("openScene", item.target.feature.uuid);
      }
    },
    populateMarkerColors() {
      for (let i = 0; i <= this.geojson.features.length; i++) {
        this.markerIconColors[i] = this.colors.neutral.darken2;
      }
    },
    updateMarkerColors(uuid) {
      const index = this.geojson.features.findIndex((a) => a.uuid === uuid) + 1;
      // Set color of visited
      this.markerIconColors[this.prevID] = this.colors.neutral.base;
      // Set color of active
      this.markerIconColors[index] = this.colors.secondary.base;
      // Redraw Markers on Key Change
      this.stopKeyIndex === 0
        ? (this.stopKeyIndex = 1)
        : (this.stopKeyIndex = 0);
      // Store current ID as prevID for next run
      this.prevID = index;
    },
  },
  created() {
    this.populateMarkerColors();
    eventBus.$on("updateMarkerColors", (uuid) => {
      this.updateMarkerColors(uuid);
    });
  },
};
</script>