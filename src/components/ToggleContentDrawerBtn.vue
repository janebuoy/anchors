<template>
  <l-control position="bottomright">
    <v-btn
      v-if="$vuetify.breakpoint.mdAndUp"
      elevation="3"
      class="ml-2"
      small
      @click.stop="toggleContentDrawer()"
      :title="
        contentDrawer
          ? this.config.toggleContentBtn.close
          : this.config.toggleContentBtn.open
      "
    >
      <v-icon left style="margin-top: 2px">
        {{ icon }}
      </v-icon>
      {{
        contentDrawer
          ? this.config.toggleContentBtn.close
          : this.config.toggleContentBtn.open
      }}
    </v-btn>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import { config } from "../../config.js";

import { mapGetters } from "vuex";
export default {
  name: "ToggleContentDrawerBtn",
  components: {
    LControl,
  },
  data() {
    return {
      config: config,
    };
  },
  computed: {
    ...mapGetters(["contentDrawer"]),
    icon() {
      let icon;
      if (this.$vuetify.breakpoint.mdAndUp) {
        if (this.contentDrawer) {
          icon = "mdi-chevron-right";
        } else {
          icon = "mdi-chevron-left";
        }
      } else {
        if (this.contentDrawer) {
          icon = "mdi-chevron-down";
        } else {
          icon = "mdi-chevron-up";
        }
      }
      return icon;
    },
  },
  methods: {
    toggleContentDrawer() {
      this.$store.commit("toggleContentDrawer");
    },
  },
};
</script>