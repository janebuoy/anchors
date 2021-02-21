<template>
  <div>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="contentDrawer"
      absolute
      right
      :width="drawerRightWidth"
      :permanent="contentDrawer"
      :bottom="$vuetify.breakpoint.smAndDown"
      color="accent lighten-5"
    >
    </v-navigation-drawer>
    <v-bottom-sheet
      ref="bottomSheet"
      v-model="contentDrawer"
      hide-overlay
      persistent
      no-click-animation
    >
      <v-bottom-navigation
        v-if="$vuetify.breakpoint.smAndDown"
        class="accent lighten-5"
      >
      </v-bottom-navigation>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: "ContentDrawer",
  data() {
    return {
      drawerRightWidth: 480,
    };
  },
  computed: {
    contentDrawer: {
      get() {
        return this.$store.getters.contentDrawer;
      },
      set(v) {
        return this.$store.dispatch("toggleContentDrawer", v);
      },
    },
    bottomSheetHeight: {
      get() {
        return this.$refs.bottomSheet.$refs.dialog.clientHeight;
      },
      set(v) {
        return this.$store.dispatch("bottomSheetHeight", v);
      },
    },
    keepOpen() {
      return this.onClickOutside;
    },
  },
  methods: {
    onClickOutside() {
      return true;
    },
  },
  updated() {
    const vm = this;
    this.$nextTick(() => {
      if (vm.$refs.bottomSheet.$refs.dialog) {
        vm.bottomSheetHeight = vm.$refs.bottomSheet.$refs.dialog.clientHeight;
      }
    });
    this.$store.dispatch("drawerRightWidth", this.drawerRightWidth);
  },
};
</script>