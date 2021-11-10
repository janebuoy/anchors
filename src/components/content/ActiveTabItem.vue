<template>
  <v-card flat tile height="100%">
    <v-card-title style="word-break: normal !important">
      {{ currentItem.title }}
    </v-card-title>
    <v-card-subtitle>{{ currentItem.subtitle }}</v-card-subtitle>
    <v-card-text
      v-if="currentItem.target === '8808cb18-8334-11eb-8dcd-0242ac130003'"
    >
      <v-sheet outlined rounded class="mx-1" color="grey lighten-4">
        <v-sheet
          v-if="!loaded"
          height="300"
          tile
          class="my-5"
          color="grey lighten-4"
        ></v-sheet>
        <D3LineChart
          :key="uuid"
          v-else
          :config="chart_config"
          :datum="measurements"
        ></D3LineChart>
        <p v-if="this.waterLevels" class="mx-6">
          {{
            "Letzte Messung: " +
            currentFeature.properties.timestamp.hours +
            ":" +
            currentFeature.properties.timestamp.minutes
          }}
          <br />
          {{
            "Wasserstand: " +
            currentFeature.properties.value.toString().replace(/\./g, ",") +
            " Meter"
          }}
          <br />
          Daten:
          <a href="https://www.pegelonline.wsv.de/webservice" target="_blank"
            >pegelonline.wsv.de/webservice</a
          >
        </p>
      </v-sheet>
      <v-select
        v-if="waterLevels"
        v-model="uuid"
        :items="items"
        item-text="properties.name"
        item-value="properties.uuid"
        @input="fetchStation(uuid)"
        dense
        class="mx-3 pt-2"
      ></v-select>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import { D3LineChart } from "vue-d3-charts";
import { eventBus } from "@/main";
import { mapGetters } from "vuex";
export default {
  name: "ActiveTabItem",
  components: {
    D3LineChart,
  },
  computed: {
    ...mapGetters(["currentItem", "isPlaying", "waterLevels"]),
    items() {
      return this.waterLevels.features;
    },
    currentFeature() {
      let currentFeature;
      if (this.waterLevels) {
        currentFeature = this.waterLevels.features.find(
          (e) => e.properties.uuid === this.uuid
        );
      } else {
        currentFeature = null;
      }
      return currentFeature;
    },
  },
  data() {
    return {
      uuid: "c1f059dd-5063-468a-9dfa-0360fe0b030d",
      measurements: [],
      loaded: false,
      chart_config: {
        date: {
          key: "timestamp",
          inputFormat: "%Y-%m-%dT%H:%M:%S.%LZ",
          outputFormat: "%H:%M",
        },
        values: ["value"],
        axis: {
          xTicks: 4,
          yTicks: 4,
        },
        points: false,
        tooltip: {
          labels: true,
        },
        color: {
          current: "#448AFF",
        },
        transition: {
          duration: 320,
          ease: "easeBackInOut",
        },
      },
    };
  },
  methods: {
    fetchStation(uuid) {
      this.loaded = false;
      const baseURL =
        "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/";
      axios
        .get(baseURL + uuid + "/W/measurements.json?start=P1D")
        .then((response) => {
          this.reduceMesaurements(response);
        });
    },
    reduceMesaurements(response) {
      this.measurements = [];
      const values = response.data.map((e) => e.value);
      const timestamps = response.data.map((e) => e.timestamp);
      const maxVal = 80;
      const delta = Math.floor(timestamps.length / maxVal);
      for (let i = 0; i < timestamps.length; i = i + delta) {
        const date = new Date(timestamps[i]);
        this.measurements.push({
          timestamp: date,
          value: values[i] / 100,
        });
      }
      this.loaded = true;
    },
  },
  created() {
    this.fetchStation(this.uuid);
    eventBus.$on("updateChart", (msg) => {
      if (this.uuid !== msg.uuid) {
        this.uuid = msg.uuid;
        this.fetchStation(msg.uuid);
      }
    });
  },
  watch: {
    uuid(val) {
      const payload = this.waterLevels.features.find(
        (e) => e.properties.uuid === val
      );
      eventBus.$emit("setCoords", payload);
    },
  },
};
</script>