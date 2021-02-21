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
      class="mt-16"
    >
      <Content />
    </v-navigation-drawer>
    <v-bottom-sheet
      v-if="$vuetify.breakpoint.smAndDown"
      ref="bottomSheet"
      v-model="contentDrawer"
      hide-overlay
      persistent
      no-click-animation
    >
      <v-card>
        <v-card-title> AudioControls </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="bottomContent px-0">
          <Content v-if="content" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Content from "./Content";

export default {
  name: "ContentDrawer",
  components: {
    Content,
  },
  data() {
    return {
      drawerRightWidth: 480,
    };
  },
  computed: {
    ...mapGetters(["currentUUID", "content"]),
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
    updateBottomSheetHeight() {
      const vm = this;
      this.$nextTick(() => {
        if (vm.$refs.bottomSheet.$refs.dialog) {
          vm.bottomSheetHeight = vm.$refs.bottomSheet.$refs.dialog.clientHeight;
        }
      });
    },
  },
  updated() {
    this.updateBottomSheetHeight();
    this.$store.dispatch("drawerRightWidth", this.drawerRightWidth);
  },
  watch: {
    currentUUID() {
      this.updateBottomSheetHeight();
    },
  },
};
</script>

<style scoped>
>>> .v-bottom-sheet.v-dialog {
  max-height: 60% !important;
}
.bottomContent {
  height: 400px;
  overflow: auto;
}
</style>