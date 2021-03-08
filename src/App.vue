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
    <AppBar />
    <DrawerLeft v-if="scenes.data" />
    <ContentDrawer />
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
    ]),
  },
  created() {
    // Make store fetch the scenes
    this.$store.dispatch("fetchScenes");
  },
};
</script>

<style>
#app {
  position: fixed;
  width: 100%;
  height: 100%;
}

main {
  position: fixed;
  width: 100%;
  height: 100%;
}

body {
  height: 100% !important;
  min-height: 100vh !important;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available !important;
}

html {
  height: 100% !important;
  height: -webkit-fill-available !important;
}
</style>