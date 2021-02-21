<template>
  <v-navigation-drawer
    v-model="drawerLeft"
    app
    left
    color="success lighten-2"
    style="z-index: 1001"
  >
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "DrawerLeft",
  computed: {
    drawerLeft: {
      get() {
        return this.$store.getters.drawerLeft;
      },
      set(v) {
        return this.$store.commit("toggleDrawerLeft", v);
      },
    },
  },
};
</script>