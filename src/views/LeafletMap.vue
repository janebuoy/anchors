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
    <!-- PATTERN LAYER -->
    <PatternLayer
      :key="'pattern'"
      ref="patternLayer"
      v-if="
        isActiveLayer(activeLayers, 'speicherXI') && JSONLayers.speicherXI.data
      "
      :geojson="JSONLayers.speicherXI.data"
    />
    <!-- ROUTE PATH -->
    <RouteLayer
      ref="routeLayer"
      :key="'route'"
      v-if="isActiveLayer(activeLayers, 'route') && JSONLayers.route.data"
      :geojson="JSONLayers.route.data"
    />
    <!-- COLONIES LAYER -->
    <ColoniesLayer
      v-if="isActiveLayer(activeLayers, 'colonies') && JSONLayers.colonies.data"
      :geojson="JSONLayers.colonies.data"
      :max="thisYear"
    />
    <!-- ACTION BOUNDS -->
    <BoundsLayer
      v-if="
        isActiveLayer(activeLayers, 'scenes') &&
        useActionBounds === true &&
        scenes
      "
      :key="'bounds'"
      ref="boundsLayer"
      :geojson="scenes"
    />
    <!-- STOP NUMBERS -->
    <StopsLayer
      v-if="isActiveLayer(activeLayers, 'scenes') && scenes"
      ref="stopsLayer"
      :geojson="scenes"
    />
    <l-control-zoom position="topleft"></l-control-zoom>
    <LocateControl ref="locateControl" :options="locateControl.options" />
    <ToggleContentDrawerBtn v-if="currentUUID" />
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
import { latLng } from "leaflet";

import { LMap, LTileLayer, LControlZoom } from "vue2-leaflet";

import PatternLayer from "@/components/map/layers/PatternLayer";
import ColoniesLayer from "@/components/map/layers/ColoniesLayer";
import RouteLayer from "@/components/map/layers/RouteLayer";
import BoundsLayer from "@/components/map/layers/BoundsLayer";
import StopsLayer from "@/components/map/layers/StopsLayer";

import LocateControl from "@/components/map/controls/LocateControl";
import ToggleContentDrawerBtn from "@/components/ToggleContentDrawerBtn";

export default {
  name: "LeafletMap",
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    ToggleContentDrawerBtn,
    LocateControl,
    PatternLayer,
    ColoniesLayer,
    RouteLayer,
    BoundsLayer,
    StopsLayer,
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
        zoom: 16,
        center: latLng(53.095, 8.7707),
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
        speicherXI: {
          url: "data/json/speicherXI.json",
          data: null,
        },
        colonies: {
          url: "data/json/countries.json",
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
      thisYear: new Date().getFullYear(),
    };
  },
  computed: {
    ...mapGetters([
      "scenes",
      "subScenes",
      "activeLayers",
      "currentUUID",
      "currentItem",
      "bottomSheetHeight",
      "contentDrawer",
      "useActionBounds",
    ]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    nextID() {
      let index;
      // set (next) index to 0 if no scene is selected yet
      if (this.currentUUID === null) {
        index = 0;
        // Otherwise find index of currently selected UUID
      } else {
        index = this.scenes.features.findIndex(
          (s) => s.uuid === this.currentUUID
        );
        // set index to 0 if last scene is reached
        if (index === this.scenes.features.length - 1) {
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
      return this.scenes.features[this.nextID].uuid;
    },
    windowHeight() {
      return this.$vuetify.breakpoint.height;
    },
  },
  methods: {
    isActiveLayer(array, payload) {
      return array.includes(payload);
    },
    openScene(uuid) {
      // Filter out single feature per UUID from scenes
      const feature = this.scenes.features.filter((a) => a.uuid === uuid)[0];
      this.pushToRoute(feature);
      const payload = {
        uuid: feature.uuid,
        nextID: this.nextID,
        common_name: feature.common_name,
        title: feature.properties.title,
        layers: feature.layers,
        content: feature.content,
        tab: 0,
      };
      this.$store.dispatch("updateState", payload);
      eventBus.$emit("updateMarkerColors", feature.id);
      this.$nextTick(() => {
        this.$store.dispatch("toggleContentDrawer", true);
        this.setCoords(feature);
      });
    },
    openSubscene(uuid) {
      const feature = this.subScenes.features.filter((a) => a.uuid === uuid)[0];
      this.setCoords(feature);
      const payload = {
        title: feature.properties.title,
        layers: feature.layers,
      };
      this.$store.dispatch("updateState", payload);
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
        //vm.mapInvalidate();
        vm.$nextTick(() => {
          vm.mapInvalidate();
        });
      }, 200);
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
    if (this.JSONLayers.route) {
      this.map = this.$refs.lmap.mapObject;
    }
  },
  created() {
    this.fetchJSONLayers();
    eventBus.$on("openScene", this.openScene);
    eventBus.$on("openSubscene", this.openSubscene);
    eventBus.$on("openNextScene", () => {
      this.openScene(this.nextUUID);
    });
    eventBus.$on("recentreMap", this.recentreMap);
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
    windowHeight() {
      this.recentreMap();
    },
  },
};
</script>