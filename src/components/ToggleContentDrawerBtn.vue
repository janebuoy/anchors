<template>
  <l-control position="bottomright">
    <v-btn
      v-if="$vuetify.breakpoint.mdAndUp"
      elevation="3"
      class="ml-2"
      color="neutral darken-3"
      dark
      @click.stop="toggleContentDrawer()"
      :title="contentDrawer ? 'Close Panel' : 'Open Panel'"
    >
      <v-icon left style="margin-top: 2px">
        {{ icon }}
      </v-icon>
      {{ contentDrawer ? "Close Panel" : "Open Panel" }}
    </v-btn>
    <v-btn
      v-else
      fab
      color="neutral darken-3"
      dark
      @click.stop="toggleContentDrawer()"
    >
      <v-icon large>
        {{ icon }}
      </v-icon>
    </v-btn>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

import { mapGetters } from "vuex";
export default {
  name: "ToggleContentDrawerBtn",
  components: {
    LControl,
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