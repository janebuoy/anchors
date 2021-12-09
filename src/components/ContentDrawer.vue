<template>
  <div>
    <v-navigation-drawer
      @transitionend.self="mapInvalidate({ pan: true })"
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
        <content-windows class="overflow-y-auto" v-if="currentUUID" />
        <keep-alive>
          <AudioPlayer class="mt-auto" v-if="currentUUID" />
        </keep-alive>
      </div>
    </v-navigation-drawer>
    <div
      @transitionend.self="
        {
          mapInvalidate({ pan: true });
          updateBottomHeight();
        }
      "
      v-if="$vuetify.breakpoint.smAndDown"
      ref="bottomSheet"
      :style="[
        contentDrawer ? { height: bottomHeight + 'px' } : { height: '144px' },
      ]"
      class="nav-wrapper expand-transition"
      style="position: fixed; bottom: 0"
    >
      <keep-alive>
        <AudioPlayer
          v-if="currentUUID"
          v-touch="{
            up: () => toggleContentDrawer(),
            down: () => toggleContentDrawer(),
          }"
          @click.native="toggleContentDrawer()"
        />
      </keep-alive>
      <content-windows class="overflow-y-auto" />
      <TabBar class="mt-auto flex-grow-0" v-if="currentUUID" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TabBar from "@/components/content/TabBar";
import ContentWindows from "@/components/content/ContentWindows";
import AudioPlayer from "./AudioPlayer";
import { eventBus } from "../main";

export default {
  name: "ContentDrawer",
  components: {
    TabBar,
    ContentWindows,
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
    ...mapGetters(["currentUUID", "content", "currentItem", "contentDrawer"]),
    contentDrawer: {
      get() {
        return this.$store.getters.contentDrawer;
      },
      set(v) {
        return this.$store.dispatch("toggleContentDrawer", v);
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
    mapInvalidate(payload) {
      eventBus.$emit("mapInvalidate", payload);
    },
    toggleContentDrawer() {
      this.contentDrawer = !this.contentDrawer;
    },
    onClickOutside() {
      return true;
    },
    updateBottomHeight() {
      this.$store.dispatch("bottomHeight", this.bottomHeight);
    },
  },
  updated() {
    this.$store.dispatch("drawerRightWidth", this.drawerRightWidth);
  },
  watch: {
    currentUUID() {
      this.updateBottomHeight();
    },
    windowHeight() {
      this.updateBottomHeight();
    },
  },
};
</script>

<style lang="scss" scoped>
>>> .v-bottom-sheet.v-dialog {
  max-height: 60% !important;
}
.nav-wrapper {
  width: 100%;
  height: 100%;
  height: -webkit-fill-available !important;
  display: flex;
  flex-direction: column;
}
.expand-transition {
  -webkit-transition: height 0.2s;
  -moz-transition: height 0.2s;
  -ms-transition: height 0.2s;
  -o-transition: height 0.2s;
  transition: height 0.2s;
}
</style>