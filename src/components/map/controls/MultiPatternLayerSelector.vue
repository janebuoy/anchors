<template>
  <l-control position="bottomright">
    <div v-if="show" class="custom-control pa-0 mb-2">
      <v-list class="py-0">
        <v-list-item-group v-model="active">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            dense
            @click.stop="viewSelected(item.props)"
          >
            <template v-slot:default="{ active, toggle }">
              <v-list-item-action class="mr-3">
                <v-checkbox
                  :input-value="active"
                  :true-value="item.props"
                  color="secondary"
                  @click.stop="
                    toggle();
                    viewSelected(item.props);
                  "
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.props.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.props.subtitle">
                  item.subtitle
                </v-list-item-subtitle>
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
  name: "MultiPatternLayerSelector",
  props: ["properties"],
  components: {
    LControl,
  },
  data() {
    return {
      show: true,
      active: 0,
      toggle: 0,
    };
  },
  computed: {
    items() {
      let result = [];
      for (const feature of this.properties.features) {
        result.push({ props: feature.properties });
      }
      return result;
    },
  },
  methods: {
    toggleSlider() {
      this.show = !this.show;
    },
    viewSelected(props) {
      eventBus.$emit("switchPortLayer", props.id);
      if (props.coordinates) eventBus.$emit("setCoords", props);
    },
  },
};
</script>