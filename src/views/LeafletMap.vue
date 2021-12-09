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
    <component
      v-for="(layer, i) in currentLayers"
      :key="i + '_' + layer.type"
      :is="layer.type"
      :data="layer.data"
    />
    <water-levels-layer
      :key="'waterLevelsLayer'"
      v-if="isActiveLayer(activeLayers, 'waterLevels')"
    />
    <!-- COLONIES LAYER -->
    <ColoniesLayer
      ref="coloniesLayer"
      v-if="isActiveLayer(activeLayers, 'colonies') && JSONLayers.colonies.data"
      :geojson="JSONLayers.colonies.data"
      :max="thisYear"
    />
    <!-- ROUTE PATH -->
    <RouteLayer
      ref="routeLayer"
      v-if="isActiveLayer(activeLayers, 'route') && JSONLayers.route.data"
      :geojson="JSONLayers.route.data"
    />
    <!-- ACTION BOUNDS -->
    <BoundsLayer
      v-if="
        isActiveLayer(activeLayers, 'scenes') &&
        useActionBounds === true &&
        scenes
      "
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
    <component
      v-for="(layer, i) in currentInfo"
      :key="i + '_' + layer.info"
      :is="layer.info"
      :properties="layer.data"
    />
    <component
      v-for="(layer, i) in currentControls"
      :key="i + '_' + layer.selector"
      :is="layer.selector"
      :properties="layer.data"
    />
    <!-- <OpacitySlider v-if="mapOptions.opacitySlider" /> -->
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

import ColoniesLayer from "@/components/map/layers/ColoniesLayer";
import RiverCorrectionLayer from "@/components/map/layers/RiverCorrectionLayer";
import RasterLayer from "@/components/map/layers/RasterLayer";
import WaterLevelsLayer from "@/components/map/layers/WaterLevelsLayer";
import PointsLayer from "@/components/map/layers/PointsLayer";
import MultiPatternLayer from "@/components/map/layers/MultiPatternLayer";
import PatternLayer from "@/components/map/layers/PatternLayer";
import RouteLayer from "@/components/map/layers/RouteLayer";
import BoundsLayer from "@/components/map/layers/BoundsLayer";
import StopsLayer from "@/components/map/layers/StopsLayer";

import LocateControl from "@/components/map/controls/LocateControl";
import OpacitySlider from "@/components/map/controls/OpacitySlider";
import PointsLayerSelector from "@/components/map/controls/PointsLayerSelector";
import LayerSelector from "@/components/map/controls/LayerSelector";
import LayerInfo from "@/components/map/info/LayerInfo";
import ToggleContentDrawerBtn from "@/components/ToggleContentDrawerBtn";

export default {
  name: "LeafletMap",
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    ToggleContentDrawerBtn,
    LocateControl,
    OpacitySlider,
    PointsLayerSelector,
    LayerSelector,
    LayerInfo,
    ColoniesLayer,
    RiverCorrectionLayer,
    RasterLayer,
    WaterLevelsLayer,
    PointsLayer,
    MultiPatternLayer,
    PatternLayer,
    RouteLayer,
    BoundsLayer,
    StopsLayer,
  },
  data() {
    return {
      mapOptions: {
        zoomControl: false,
        minZoom: 1,
        minZoomDefault: 1,
        maxZoom: 18,
        maxZoomDefault: 18,
        zoomSnap: 0.2,
        opacitySlider: false,
      },
      baseLayer: {
        zoom: 16,
        center: latLng(53.095, 8.7707),
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
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
        cotton: {
          url: "data/json/cotton.json",
          data: null,
        },
        coffeeBremen: {
          url: "data/json/coffeeBremen.json",
          data: null,
        },
        coffeeWorld: {
          url: "data/json/coffeeWorld.json",
          data: null,
        },
        streets: {
          url: "data/json/streets.json",
          data: null,
        },
        ports: {
          url: "data/json/ports.json",
          data: null,
        },
        river: {
          url: "data/json/river.json",
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
      "bottomHeight",
      "contentDrawer",
      "useActionBounds",
      "waterLevels",
    ]),
    currentLayers() {
      const active = this.activeLayers.filter(
        (e) => e.name !== "route" && e.name !== "scenes"
      );
      let result = [];
      const layerTypes = ["PointsLayer", "MultiPatternLayer", "PatternLayer"];
      for (const layer of active) {
        if (layerTypes.includes(layer.type)) {
          result.push({
            type: layer.type,
            source: layer.source,
            data: this.JSONLayers[layer.short].data,
          });
        } else if (layer.type === "RasterLayer") {
          result.push({
            type: layer.type,
            source: layer.source,
            data: layer.url,
          });
        }
      }
      return result;
    },
    currentInfo() {
      const active = this.activeLayers.filter(
        (e) => e.name !== "route" && e.name !== "scenes"
      );
      let result = [];
      for (const layer of active) {
        if (layer.info) {
          result.push({
            info: layer.info,
            data: this.JSONLayers[layer.short].data,
          });
        }
      }
      return result;
    },
    currentControls() {
      const active = this.activeLayers.filter(
        (e) => e.name !== "route" && e.name !== "scenes"
      );
      let result = [];
      for (const layer of active) {
        if (layer.selector && layer.selector !== "OpacityControl") {
          result.push({
            selector: layer.selector,
            data: this.JSONLayers[layer.short].data,
          });
        } else if (layer.selector === "OpacityControl") {
          result.push({
            data: layer.type,
          });
        }
      }
      return result;
    },
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
      const result = array.map((e) => e.name);
      return result.includes(payload);
    },
    openScene(uuid) {
      // Filter out single feature per UUID from scenes
      const feature = this.scenes.features.filter((a) => a.uuid === uuid)[0];
      const payload = {
        uuid: feature.uuid,
        nextID: this.nextID,
        common_name: feature.common_name,
        title: feature.properties.title,
        layers: feature.layers,
        isSubscene: false,
        content: feature.content,
        tab: 0,
      };
      this.$store.dispatch("updateState", payload);
      eventBus.$emit("updateMarkerColors", feature.uuid);
      this.$nextTick(() => {
        this.$store.dispatch("toggleContentDrawer", true);
      });
      this.applyOptions(feature);
      this.setCoords(feature);
    },
    openSceneDefaults(uuid) {
      const feature = this.scenes.features.filter((a) => a.uuid === uuid)[0];
      const payload = {
        layers: feature.layers,
        isSubscene: false,
      };
      this.$store.dispatch("updateState", payload);
      this.applyOptions(feature);
      this.setCoords(feature);
    },
    openSubscene(uuid) {
      const feature = this.subScenes.features.filter((a) => a.uuid === uuid)[0];
      const payload = {
        title: feature.properties.title,
        layers: feature.layers,
        isSubscene: true,
      };
      this.$store.dispatch("updateState", payload);
      this.applyOptions(feature);
      this.setCoords(feature);
    },
    applyOptions(feature) {
      // Set feature settings
      if (feature.properties.minZoom !== undefined) {
        this.mapOptions.minZoom = feature.properties.minZoom;
      } else {
        this.mapOptions.minZoom = this.mapOptions.minZoomDefault;
      }
      if (feature.properties.maxZoom !== undefined) {
        this.mapOptions.maxZoom = feature.properties.maxZoom;
      } else {
        this.mapOptions.maxZoom = this.mapOptions.maxZoomDefault;
      }
      if (feature.properties.opacitySlider !== undefined) {
        this.mapOptions.opacitySlider = feature.properties.opacitySlider;
      } else {
        this.mapOptions.opacitySlider = false;
      }
      if (feature.properties.waterLevel !== undefined) {
        this.mapOptions.waterLevel = feature.properties.waterLevel;
      }
    },
    setCoords(feature) {
      let zoom;
      if (this.isMobile && feature.properties.zoom) {
        zoom = feature.properties.zoom - 1;
      } else {
        zoom = feature.properties.zoom;
      }
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];
      const latlng = L.latLng(lat, lng);

      if (feature.properties.flyTo === true) {
        this.map.flyTo(latlng, zoom, feature.properties.flyToOptions);
      } else {
        this.map.setView(latlng, zoom);
      }
    },
    updateZoom() {
      const flyToOptions = {
        duration: 0.3,
        easeLinearity: 0.2,
      };
      const center = this.map.getCenter();
      let zoom = this.map.getZoom();
      if (!this.isActiveLayer(this.activeLayers, "correctionLayer")) {
        if (this.isMobile) {
          zoom--;
        } else {
          zoom++;
        }
      }
      this.map.flyTo(center, zoom, flyToOptions);
    },
    mapInvalidate(payload) {
      // make sure "ref" is not exactly "map"
      // See: https://github.com/xkjyeah/vue-google-maps/issues/260#issuecomment-429323819
      this.map.invalidateSize({
        pan: payload.pan,
        animate: true,
        debounceMoveend: true,
      });
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
    eventBus.$on("openSceneDefaults", this.openSceneDefaults);
    eventBus.$on("openSubscene", this.openSubscene);
    eventBus.$on("openNextScene", () => {
      this.openScene(this.nextUUID);
    });
    eventBus.$on("setCoords", this.setCoords);
    eventBus.$on("mapInvalidate", this.mapInvalidate);
  },
  watch: {
    // Watch for map height size changes
    bottomHeight() {
      this.mapInvalidate({ pan: false });
    },
    isMobile() {
      this.updateZoom();
      const vm = this;
      setTimeout(function () {
        vm.$nextTick(() => {
          vm.mapInvalidate({ pan: true });
        });
      }, 200);
    },
  },
};
</script>