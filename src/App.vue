<template>
  <v-app style="overflow: hidden">
    <v-main
      :style="[
        contentDrawer && $vuetify.breakpoint.smAndDown
          ? { paddingBottom: bottomSheetHeight + 'px' }
          : null,
        contentDrawer && $vuetify.breakpoint.mdAndUp
          ? { paddingRight: drawerRightWidth + 'px' }
          : null,
      ]"
    >
      <router-view />
    </v-main>
    <AppBar v-if="scenes" />
    <DrawerLeft v-if="scenes" />
    <ContentDrawer v-if="currentUUID" />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import AppBar from "./components/AppBar";
import DrawerLeft from "./components/DrawerLeft";
import ContentDrawer from "./components/ContentDrawer";

export default {
  name: "App",
  components: {
    AppBar,
    DrawerLeft,
    ContentDrawer,
  },
  computed: {
    ...mapGetters([
      "bottomSheetHeight",
      "contentDrawer",
      "drawerRightWidth",
      "scenes",
      "currentUUID",
    ]),
  },
  created() {
    // Make store fetch the scenes
    this.$store.dispatch("fetchScenes");
    this.$store.dispatch("fetchTimeline");
    this.$store.dispatch("fetchGalleries");
    //this.$store.dispatch("fetchWeserWaterLevels");
  },
};
</script>