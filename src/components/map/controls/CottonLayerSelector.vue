<template>
  <l-control position="bottomright">
    <div v-if="show" class="custom-control pa-0 mb-2">
      <v-list class="py-0">
        <v-list-item-group v-model="active">
          <v-list-item
            v-for="(item, i) in features"
            :key="i"
            dense
            @click.stop="viewSelected(item)"
          >
            <template v-slot:default="{ active, toggle }">
              <v-list-item-action class="mr-3">
                <v-checkbox
                  :input-value="active"
                  :true-value="item"
                  color="secondary"
                  @click.stop="
                    toggle();
                    viewSelected(item);
                  "
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.subtitle"
                  >item.subtitle</v-list-item-subtitle
                >
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="d-flex">
      <v-btn
        :fab="$vuetify.breakpoint.smAndDown"
        dark
        color="secondary"
        class="ml-auto mb-auto"
        @click.stop="toggleSlider"
        :title="show ? 'Close Layer Selector' : 'Open Layer Selector'"
      >
        <v-icon
          :left="!$vuetify.breakpoint.smAndDown"
          :small="!$vuetify.breakpoint.smAndDown"
        >
          mdi-layers-triple-outline
        </v-icon>
        {{ !$vuetify.breakpoint.smAndDown ? "Toggle Layers" : null }}
      </v-btn>
    </div>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import { eventBus } from "../../../main";

export default {
  name: "CottonLayerSelector",
  components: {
    LControl,
  },
  data() {
    return {
      show: true,
      active: 0,
      toggle: 0,
      features: [
        {
          id: 0,
          name: "Bremen",
          zoom: 11,
          geometry: {
            coordinates: [8.7564, 53.1168],
          },
          type: "Point",
        },
        {
          id: 1,
          name: "World",
          zoom: 3,
          geometry: {
            coordinates: [8.7564, 53.1168],
          },
          type: "Point",
        },
      ],
    };
  },
  methods: {
    toggleSlider() {
      this.show = !this.show;
    },
    viewSelected(item) {
      eventBus.$emit("switchLayer", item.id);
    },
  },
};
</script>