<template>
  <v-app style="overflow: hidden">
    <v-main
      :style="[
        contentDrawer && $vuetify.breakpoint.mdAndUp
          ? { paddingRight: drawerRightWidth + 'px' }
          : null,
      ]"
    >
				<AppBar v-if="scenes" :style="[
        contentDrawer && $vuetify.breakpoint.smAndDown
          ? { paddingBottom: bottomHeight + 'px' }
          : null,
        !contentDrawer && currentUUID ? { paddingBottom: '160px' } : null,
        !contentDrawer && $vuetify.breakpoint.mdAndUp
          ? { paddingBottom: '0px' }
          : null,
        contentDrawer && $vuetify.breakpoint.mdAndUp
          ? { paddingRight: drawerRightWidth + 'px' }
          : null,
      ]"/>
      <router-view />
    </v-main>
    <DrawerLeft v-if="scenes" />
    <ContentDrawer />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

import AppBar from './components/AppBar';
import DrawerLeft from './components/DrawerLeft';
import ContentDrawer from './components/ContentDrawer';

export default {
  name: 'App',
  head: {
    title: 'Ankerpunkte der Verflechtung',
    titleTemplate:
      '%s | Ein postkolonialer Rundgang durch die Bremer Überseestadt',
    htmlAttrs: {
      lang: 'de-DE',
    },
    meta: [
      {
        name: 'description',
        content: 'Ein postkolonialer Rundgang durch die Bremer Überseestadt',
      },
    ],
  },
  components: {
    AppBar,
    DrawerLeft,
    ContentDrawer,
  },
  computed: {
    ...mapGetters([
      'bottomHeight',
      'contentDrawer',
      'drawerRightWidth',
      'scenes',
      'currentUUID',
    ]),
  },
  created() {
    // Make store fetch the scenes
    this.$store.dispatch('fetchScenes');
    this.$store.dispatch('fetchGalleries');
    //this.$store.dispatch("fetchWeserWaterLevels");
  },
};
</script>
