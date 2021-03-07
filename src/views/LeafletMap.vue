<template>
  <l-map
    ref="lmap"
    :zoom="baseLayer.zoom"
    :center="baseLayer.center"
    :options="mapOptions"
    class="overflow-hidden"
    style="z-index: 100"
  >
    <l-tile-layer
      ref="baseLayer"
      :url="baseLayer.url"
      :attribution="baseLayer.attribution"
    />
    <!-- ROUTE PATH -->
    <l-geo-json
      ref="routeLayer"
      :key="'route'"
      v-if="isActiveLayer(activeLayers, 'route')"
      :geojson="JSONLayers.route.data"
      :options-style="styleRoute"
    />
    <!-- ACTION BOUNDS -->
    <l-geo-json
      v-if="isActiveLayer(activeLayers, 'scenes') && useActionBounds === true"
      :key="'bounds'"
      ref="stationsLayer"
      :geojson="scenes.data"
      :options="optionsStopBounds"
    />
    <!-- STOP NUMBERS -->
    <l-geo-json
      v-if="isActiveLayer(activeLayers, 'scenes')"
      :key="'scenes' + stopKeyIndex"
      ref="stopsLayer"
      :geojson="scenes.data"
      :options="optionsScenes"
    />
    <l-control position="bottomright" v-if="currentItem">
      <ToggleContentDrawerBtn />
    </l-control>
    <l-control-zoom position="topleft"></l-control-zoom>
    <LocateControl ref="locateControl" :options="locateControl.options" />
  </l-map>
</template>

<script>
import axios from "axios";
const ax = axios.create({
  baseURL: process.env.BASE_URL,
});
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";
import L from "leaflet";
import { latLng, icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LGeoJson,
  LControl,
  LControlZoom,
} from "vue2-leaflet";

import LocateControl from "@/components/LocateControl";
import ToggleContentDrawerBtn from "@/components/ToggleContentDrawerBtn";

export default {
  name: "LeafletMap",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LControl,
    LControlZoom,
    ToggleContentDrawerBtn,
    LocateControl,
  },
  data() {
    return {
      mapOptions: {
        zoomControl: false,
        minZoom: 1,
        maxZoom: 18,
        zoomSnap: 0.2,
      },
      baseLayer: {
        zoom: 15,
        center: latLng(53.0933, 8.8249),
        url:
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        attribution: `
            &copy
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
            contributors &copy
            <a href="https://carto.com/attributions">CARTO</a>
            `,
      },
      JSONLayers: {
        route: {
          url: "data/json/route.json",
          data: null,
        },
      },
      locateControl: {
        object: Object,
        options: {
          keepCurrentZoomLevel: true,
          returnToPrevBounds: false,
          drawCircle: true,
          color: "secondary",
          icon: "mdi mdi-map-marker",
          iconLoading: "mdi mdi-loading mdi-spin",
        },
      },
      colors: this.$vuetify.theme.themes.light,
      markerIconColors: [],
      stopKeyIndex: 0,
      prevID: null,
    };
  },
  computed: {
    ...mapGetters([
      "scenes",
      "activeLayers",
      "markerIcons",
      "currentUUID",
      "currentItem",
      "bottomSheetHeight",
      "contentDrawer",
      "useActionBounds",
    ]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    optionsScenes() {
      return {
        onEachFeature: this.onEachFeatureScenes,
        pointToLayer: this.pointToLayerScenes,
      };
    },
    optionsStopBounds() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayerStopBounds,
      };
    },
    onEachFeatureScenes() {
      return (feature, layer) => {
        layer.on({
          click: this.onStopClick,
        });
      };
    },
    pointToLayerScenes() {
      return (feature, latlng) => {
        const points = this.scenes.data.features;
        // Match scenes.data IDs with ID of given feature
        const id = points.map((a) => a.id === feature.id).indexOf(true) + 1;
        const svg =
          "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g><path d='" +
          this.markerIcons.fg[id] +
          "' fill='" +
          this.markerIconColors[id] +
          "' fill-opacity='1' stroke='#6B818C' stroke-opacity='0.5' stroke-width='.5'/><path d='" +
          this.markerIcons.bg[id] +
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
    pointToLayerStopBounds() {
      return (_, latlng) => {
        const style = {
          radius: 50,
          fillColor: this.colors.primary.lighten3,
          color: this.colors.primary.darken3,
          fillOpacity: 0.2,
          opacity: 0.1,
          weight: 1,
        };
        return L.circle(latlng, style);
      };
    },
    styleRoute() {
      // ! need touch fillColor in computed to re-calculate when change fillColor
      // const fillColor = this.fillColor;
      return {
        color: this.colors.primary.base,
        weight: 3,
        opacity: 0.7,
        stroke: true,
        lineCap: "round",
        dashArray: "0.7 6",
      };
    },
    nextID() {
      let index;
      // set (next) index to 0 if no scene is selected yet
      if (this.currentUUID === null) {
        index = 0;
        // Otherwise find index of currently selected UUID
      } else {
        index = this.scenes.data.features.findIndex(
          (s) => s.uuid === this.currentUUID
        );
        // set index to 0 if last scene is reached
        if (index === this.scenes.data.features.length - 1) {
          index = 0;
          // otherwise add 1 to index
        } else {
          index++;
        }
      }
      return index;
    },
    nextUUID() {
      // Return UUID of next Scene
      return this.scenes.data.features[this.nextID].uuid;
    },
  },
  methods: {
    isActiveLayer(array, payload) {
      return array.includes(payload);
    },
    onStopClick(item) {
      if (item.target.feature.uuid !== this.currentUUID) {
        this.openScene(item.target.feature.uuid);
      }
    },
    openScene(uuid) {
      // Filter out single feature per UUID from scenes
      const feature = this.scenes.data.features.filter(
        (a) => a.uuid === uuid
      )[0];
      this.setCoords(feature);
      this.pushToRoute(feature);
      this.$store.dispatch("toggleContentDrawer", true);
      const payload = {
        uuid: feature.uuid,
        nextID: this.nextID,
        common_name: feature.common_name,
        title: feature.properties.title,
        layers: feature.layers,
        content: feature.content,
      };
      this.$store.dispatch("updateState", payload);
      this.updateMarkerColors(feature.id);
    },
    populateMarkerColors() {
      for (let i = 0; i <= 11; i++) {
        this.markerIconColors[i] = this.colors.neutral.darken2;
      }
    },
    updateMarkerColors(id) {
      // Set color of visited
      this.markerIconColors[this.prevID] = this.colors.neutral.lighten2;
      // Set color of active
      this.markerIconColors[id] = this.colors.accent.base;
      // Redraw Markers on Key Change
      if (this.stopKeyIndex === 0) {
        this.stopKeyIndex = 1;
      } else {
        this.stopKeyIndex = 0;
      }
      // Store current ID as prevID for next run
      this.prevID = id;
    },
    setCoords(feature) {
      const zoom = feature.properties.zoom;
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];
      const latlng = L.latLng(lat, lng);

      if (feature.properties.flyTo === true) {
        this.map.flyTo(latlng, zoom, feature.properties.flyToOptions);
      } else {
        this.map.setView(latlng, zoom);
      }
    },
    pushToRoute(feature) {
      const station = feature.common_name;
      const uuid = feature.uuid;
      if (this.$route.query !== station) {
        try {
          this.$router.push({ query: { station }, params: { uuid } });
        } catch (error) {
          // eslint-disable-next-line
          if (!(error instanceof NavigationDuplicated)) {
            throw error;
          }
        }
      }
    },
    mapInvalidate() {
      // make sure "ref" is not exactly "map"
      // See: https://github.com/xkjyeah/vue-google-maps/issues/260#issuecomment-429323819
      this.map.invalidateSize({ animate: true, debounceMoveend: true });
    },
    recentreMap() {
      const vm = this;
      setTimeout(function () {
        vm.mapInvalidate();
      }, 120);
    },
    async fetchJSONLayers() {
      for (let layer in this.JSONLayers) {
        ax.get(this.JSONLayers[layer].url)
          .then((response) => {
            this.JSONLayers[layer].data = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    // Assign the Leaflet mapObject to map
    if (this.JSONLayers.route && this.scenes) {
      this.map = this.$refs.lmap.mapObject;
    }
  },
  created() {
    this.fetchJSONLayers();
    eventBus.$on("openScene", this.openScene);
    eventBus.$on("openNextScene", () => {
      this.openScene(this.nextUUID);
    });
    this.populateMarkerColors();
  },
  watch: {
    // Watch for map height size changes
    bottomSheetHeight() {
      this.recentreMap();
    },
    // Watch for contentDrawer changes
    contentDrawer() {
      this.recentreMap();
    },
    isMobile() {
      this.recentreMap();
    },
  },
};
</script>