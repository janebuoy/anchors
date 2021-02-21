<template>
  <v-app-bar app dark color="primary" elevate-on-scroll clipped-right>
    <v-app-bar-nav-icon @click="toggleDrawerLeft()"></v-app-bar-nav-icon>
    <v-spacer />
    <v-btn @click="toggleContentDrawer()">Toggle ContentDrawer</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  methods: {
    toggleDrawerLeft() {
      this.$store.dispatch("toggleDrawerLeft");
    },
    toggleContentDrawer() {
      this.$store.dispatch("toggleContentDrawer");
    },
  },
};
</script>
