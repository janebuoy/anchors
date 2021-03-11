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
      class="pt-16"
    >
      <div class="nav-wrapper overflow-hidden">
        <Content v-if="content" class="overflow-y-auto" />
        <AudioPlayer v-if="currentItem" class="mt-auto" />
      </div>
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
        <AudioPlayer v-if="currentItem" />
        <v-card-text class="px-0 py-0" style="height: 388px">
          <Content v-if="content" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Content from "./Content";
import AudioPlayer from "./AudioPlayer";

export default {
  name: "ContentDrawer",
  components: {
    Content,
    AudioPlayer,
  },
  data() {
    return {
      drawerRightWidth: 480,
      contentKey: 0,
      scrollTimer: 120,
    };
  },
  computed: {
    ...mapGetters(["currentUUID", "content", "currentItem"]),
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
        if (this.$vuetify.breakpoint.smAndDown) {
          return this.$refs.bottomSheet.$refs.dialog.clientHeight;
        } else {
          return null;
        }
      },
      set(v) {
        return this.$store.dispatch("bottomSheetHeight", v);
      },
    },
    keepOpen() {
      return this.onClickOutside;
    },
    windowHeight() {
      return this.$vuetify.breakpoint.height;
    },
  },
  methods: {
    onClickOutside() {
      return true;
    },
    updateBottomSheetHeight() {
      // Make sure the refs are available, otherwise vue might throw errors
      if (this.$refs.bottomSheet && this.$refs.bottomSheet.$refs.dialog) {
        const vm = this;
        this.$nextTick(() => {
          vm.bottomSheetHeight = vm.$refs.bottomSheet.$refs.dialog.clientHeight;
        });
      }
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
    windowHeight() {
      this.updateBottomSheetHeight();
    },
  },
};
</script>

<style lang="scss" scoped>
>>> .v-bottom-sheet.v-dialog {
  max-height: 60% !important;
}
.nav-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>