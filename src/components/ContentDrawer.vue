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
          updateBottomHeight(bottomHeight - allowedDiff);
          mapInvalidate({ pan: true });
        }
      "
      v-if="$vuetify.breakpoint.smAndDown"
      ref="bottomSheet"
      :style="{ height: bottomHeight - allowedDiff + 'px' }"
      class="nav-wrapper"
      :class="!dragging ? 'expand-transition' : null"
      style="position: fixed; bottom: 0"
    >
      <div
        class="resizer"
        @mousedown="(e) => mouseDownHandler(e)"
        v-touch="{
          start: () => down(),
          move: (e) => resize(e),
          end: () => up(),
        }"
      ></div>
      <keep-alive>
        <AudioPlayer
          @toggleContentDrawer="toggleContentDrawer()"
          v-if="currentUUID"
          v-touch="{
            start: () => down(),
            move: (e) => resize(e),
            end: () => up(),
          }"
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
      diff: 0,
      dragging: false,
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
    min() {
      return this.windowHeight * 0.5 - this.bottomHeight;
    },
    max() {
      return this.bottomHeight - 144;
    },
    allowedDiff() {
      if (this.diff < this.max && this.diff > this.min) {
        return this.diff;
      } else if (this.diff >= this.max) {
        return this.max;
      } else {
        return this.min;
      }
    },
  },
  methods: {
    mapInvalidate(payload) {
      eventBus.$emit("mapInvalidate", payload);
    },
    mouseDownHandler() {
      this.dragging = true;
      // Attach the listeners to `document`
      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler);
    },
    mouseMoveHandler(e) {
      this.diff = e.clientY - (this.windowHeight - this.bottomHeight);
    },
    mouseUpHandler() {
      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler);
      this.up();
    },
    down() {
      this.dragging = true;
    },
    resize(e) {
      this.diff = e.touchmoveY - (this.windowHeight - this.bottomHeight);
    },
    up() {
      this.dragging = false;
      this.$nextTick(() => {
        this.updateBottomHeight(this.bottomHeight - this.allowedDiff);
        this.mapInvalidate({ pan: true });
      });
    },
    onClickOutside() {
      return true;
    },
    updateBottomHeight(height) {
      this.$store.dispatch("bottomHeight", height);
    },
    toggleContentDrawer() {
      this.contentDrawer = !this.contentDrawer;
      if (!this.contentDrawer) {
        this.diff = this.max;
      } else {
        this.diff = 0;
      }
    },
  },
  updated() {
    this.$store.dispatch("drawerRightWidth", this.drawerRightWidth);
  },
  watch: {
    currentUUID() {
      this.updateBottomHeight(this.bottomHeight - this.allowedDiff);
    },
    windowHeight() {
      this.updateBottomHeight(this.bottomHeight - this.allowedDiff);
    },
    contentDrawer() {
      this.updateBottomHeight(this.bottomHeight - this.allowedDiff);
      this.mapInvalidate({ pan: true });
    },
    allowedDiff() {
      if (this.allowedDiff >= this.max) {
        this.contentDrawer = false;
      } else if (this.allowedDiff > 0) {
        this.contentDrawer = true;
      }
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
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  background: var(--v-background-base);
}
.expand-transition {
  -webkit-transition: height 0.2s;
  -moz-transition: height 0.2s;
  -ms-transition: height 0.2s;
  -o-transition: height 0.2s;
  transition: height 0.2s;
}
.resizer {
  position: absolute;
  z-index: 3000;
  top: 0;
  left: 0;
  cursor: ns-resize;
  height: 5px;
  width: 100%;
}
</style>