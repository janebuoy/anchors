<template>
  <l-map
    ref="lmap"
    :zoom="baseLayer.zoom"
    :center="baseLayer.center"
    class="overflow-hidden"
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
      :geojson="JSONLayers.route.src"
      :options-style="styleRoute"
    />
    <!-- STOP NUMBERS -->
    <l-geo-json
      v-if="isActiveLayer(activeLayers, 'scenes')"
      :key="'scenes'"
      ref="stopsLayer"
      :geojson="JSONLayers.scenes.src"
      :options="optionsScenes"
    />
  </l-map>
</template>

<script>
import axios from "axios";
const ax = axios.create({
  baseURL: process.env.BASE_URL,
});
import { mapGetters } from "vuex";
import L from "leaflet";
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";

export default {
  name: "LeafletMap",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data() {
    return {
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
          src: null,
        },
        scenes: {
          url: "data/json/scenes.json",
          src: null,
        },
      },
      colors: this.$vuetify.theme.themes.light,
    };
  },
  computed: {
    ...mapGetters([
      "activeLayers",
      "markerIcons",
      "currentUUID",
      "bottomSheetHeight",
      "contentDrawer",
    ]),
    optionsScenes() {
      return {
        onEachFeature: this.onEachFeatureScenes,
        pointToLayer: this.pointToLayerScenes,
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
        const points = this.JSONLayers.scenes.src.features;
        // Match getMainScenes IDs with ID of given feature
        const id = points.map((a) => a.id === feature.id).indexOf(true) + 1;
        const markerIcon = icon({
          iconUrl: this.markerIcons[id],
          iconSize: [32, 37],
          iconAnchor: [16, 18],
        });
        return new L.Marker(latlng, { icon: markerIcon });
      };
    },
    styleRoute() {
      // ! need touch fillColor in computed to re-calculate when change fillColor
      // const fillColor = this.fillColor;
      return {
        color: this.colors["primary"],
        weight: 3,
        opacity: 0.7,
        stroke: true,
        lineCap: "round",
        dashArray: "0.7 6",
      };
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
      const feature = this.JSONLayers.scenes.src.features.filter(
        (a) => a.uuid === uuid
      )[0];
      this.setCoords(feature);
      this.pushToRoute(feature);
      this.$store.dispatch("toggleContentDrawer", true);
      const payload = {
        uuid: feature.uuid,
        common_name: feature.common_name,
        title: feature.properties.title,
        layers: feature.layers,
        content: feature.content,
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
        vm.mapInvalidate();
      }, 120);
    },
    async fetchJSONLayers() {
      for (let layer in this.JSONLayers) {
        ax.get(this.JSONLayers[layer].url)
          .then((response) => {
            this.JSONLayers[layer].src = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    // Assign the Leaflet mapObject to map
    if (this.JSONLayers.route && this.JSONLayers.scenes) {
      this.map = this.$refs.lmap.mapObject;
    }
  },
  created() {
    this.fetchJSONLayers();
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
  },
};
</script>