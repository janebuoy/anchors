<template>
  <v-app>
    <v-main
      :style="[
        contentDrawer && $vuetify.breakpoint.smAndDown
          ? { paddingBottom: bottomSheetHeightPx }
          : null,
        contentDrawer && $vuetify.breakpoint.mdAndUp
          ? { paddingRight: drawerRightWidthPx }
          : null,
      ]"
    >
      <router-view />
    </v-main>
    <AppBar />
    <DrawerLeft />
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
    ...mapGetters(["bottomSheetHeight", "contentDrawer", "drawerRightWidth"]),
    bottomSheetHeightPx() {
      return this.bottomSheetHeight + "px";
    },
    drawerRightWidthPx() {
      return this.drawerRightWidth + "px";
    },
  },
};
</script>
