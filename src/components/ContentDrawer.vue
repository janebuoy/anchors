<template>
  <div>
    <v-navigation-drawer
      v-if="!$vuetify.breakpoint.smAndDown"
      v-model="contentDrawer"
      absolute
      right
      :width="drawerRightWidth"
      :permanent="contentDrawer"
      :bottom="$vuetify.breakpoint.smAndDown"
      class="pt-16"
    >
      <div class="nav-wrapper overflow-hidden">
        <TabBar class="flex-grow-0" v-if="currentUUID" />
        <TabItems class="overflow-y-auto" v-if="currentUUID" />
        <AudioPlayer class="mt-auto" />
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
      <div :style="{ height: bottomHeight + 'px' }" class="nav-wrapper">
        <AudioPlayer />
        <TabItems class="overflow-y-auto" v-if="currentUUID" />
        <TabBar class="mt-auto flex-grow-0" v-if="currentUUID" />
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import TabBar from "@/components/content/TabBar";
import TabItems from "@/components/content/TabItems";
import AudioPlayer from "./AudioPlayer";

export default {
  name: "ContentDrawer",
  components: {
    TabBar,
    TabItems,
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
    bottomHeight() {
      return this.windowHeight * 0.6;
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