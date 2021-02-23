<template>
  <div>
    <v-btn
      v-if="this.$vuetify.breakpoint.mdAndUp"
      elevation="3"
      rounded
      x-large
      class="ml-2"
      color="accent"
      @click.stop="toggleContentDrawer()"
    >
      <v-icon left>
        {{ icon }}
      </v-icon>
      Content Panel
    </v-btn>
    <v-btn v-else fab color="accent" @click.stop="toggleContentDrawer()">
      <v-icon large>
        {{ icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ToggleContentDrawerBtn",
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