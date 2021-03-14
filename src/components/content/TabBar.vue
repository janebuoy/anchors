<template>
  <div id="tabsWrapper" class="d-flex">
    <v-tabs
      :value="pinned"
      slider-color="accent darken-1"
      dark
      background-color="secondary"
      optional
      style="max-width: 90px"
    >
      <v-tab @click.stop="openTab('pinned', $event)">
        <v-icon>mdi-view-list</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs
      :value="active"
      dark
      background-color="secondary"
      optional
      center-active
      right
      class="shrunk-tabs"
    >
      <v-tabs-slider color="accent darken-1" ref="tabsSlider" />
      <v-tab
        v-for="item in resources"
        :key="item.id"
        class="px-1"
        @click.stop="openTab(item.id, $event)"
        style="min-width: 60px"
        :class="{ 'v-tab--active': active === item.id }"
      >
        <v-badge
          color="accent darken-3"
          overlap
          :value="item.type === 'audio' && isPlaying && source === item.src"
        >
          <template v-slot:badge>
            <v-icon style="margin-top: -2px" class="mdi-pulseeffect"
              >mdi-play</v-icon
            >
          </template>
          <span class="pl-2">{{ item.id + 1 + "." }}</span>
          <v-icon
            class="pr-2"
            :color="active === item.id ? 'white' : 'rgba(255, 255, 255, 0.6)'"
          >
            {{ icon(item) }}
          </v-icon>
        </v-badge>
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../../main";

export default {
  name: "TabBar",
  data() {
    return {
      active: null,
      pinned: 0,
      sliderWidth: "63px",
    };
  },
  computed: {
    ...mapGetters([
      "scenes",
      "resources",
      "currentItem",
      "tabs",
      "currentUUID",
      "isPlaying",
    ]),
    source() {
      return window.player.attributes.src.nodeValue;
    },
  },
  methods: {
    icon(item) {
      if (item.type === "audio") {
        if (
          this.tabs[this.currentUUID].visited.has(item.id) &&
          !this.isPlaying
        ) {
          return "mdi-check-bold";
        } else {
          return item.icon;
        }
      } else {
        if (this.tabs[this.currentUUID].visited.has(item.id)) {
          return "mdi-check-bold";
        } else {
          return item.icon;
        }
      }
    },
    openTab(id) {
      if (Number.isInteger(id)) {
        // add last active ID to tabs.currentUUID.visited in state
        this.$store.dispatch("addVisited", this.active);
        this.active = id;
        this.pinned = 1;
        // Share state with TabItems component
        eventBus.$emit("updateTab", id);
        // Open Item in ContenList
        eventBus.$emit("openItemByID", id, "no-toggle");
        this.preserveSliderWidth();
      } else if (id === "pinned") {
        this.active = null;
        this.pinned = 0;
        eventBus.$emit("updateTab", id);
      }
    },
    updateTab(id) {
      if (Number.isInteger(id)) {
        this.active = id;
        this.pinned = 1;
      } else if (id === "pinned") {
        this.active = null;
        this.pinned = 0;
        this.$refs.tabsSlider.$el.parentElement.style.minWidth = 0;
      }
    },
    preserveSliderWidth() {
      this.$refs.tabsSlider.$el.parentElement.style.minWidth = this.sliderWidth;
    },
    resetTabs() {
      this.active = null;
      this.pinned = 0;
      this.$refs.tabsSlider.$el.parentElement.style.minWidth = 0;
    },
  },
  mounted() {
    this.active = this.tabs[this.currentUUID].active;
    this.pinned = this.tabs[this.currentUUID].pinned;
  },
  created() {
    eventBus.$on("updateTab", this.updateTab);
    eventBus.$on("openScene", this.resetTabs);
    eventBus.$on("openNextScene", this.resetTabs);
  },
  beforeDestroy() {
    const payload = {
      active: this.active,
      pinned: this.pinned,
    };
    this.$store.commit("saveTabsState", payload);
  },
};
</script>

<style scoped>
.shrunk-tabs {
  width: calc(100% - 90px);
}
</style>