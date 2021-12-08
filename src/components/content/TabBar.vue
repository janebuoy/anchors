<template>
  <div id="tabsWrapper" class="d-flex tabs-wrapper">
    <v-tabs
      :value="pinned"
      dark
      background-color="secondary"
      optional
      style="max-width: 90px, height: 48px"
    >
      <v-tabs-slider color="accent darken-1" ref="pinnedTabsSlider" />
      <!-- extended v-tab -->
      <single-tab
        @click.stop="openTab('pinned', $event)"
        :title="config.tabs.overview"
        :color="pinned === 0 ? 'white' : 'rgba(255, 255, 255, 0.6)'"
        :class="{ 'v-tab--active': pinned === 0 }"
        :aria-selected="pinned === 0 ? 'true' : 'false'"
        style="height: 48px"
      >
        <v-icon>mdi-view-list</v-icon>
      </single-tab>
    </v-tabs>
    <v-tabs
      :value="active"
      dark
      background-color="secondary"
      optional
      center-active
      right
      style="height: 48px"
      class="shrunk-tabs"
    >
      <v-tabs-slider color="accent darken-1" ref="tabsSlider" />
      <single-tab
        v-for="item in resources"
        :key="(item.id + 1) * count"
        class="px-1"
        @click.stop="openTab(item.id, $event)"
        style="min-width: 60px; height: 48px"
        :class="{ 'v-tab--active': active === item.id }"
        :aria-selected="active === item.id ? 'true' : 'false'"
        :title="
          item.type.charAt(0).toUpperCase() +
          item.type.slice(1) +
          ': ' +
          item.title
        "
      >
        <v-badge
          color="accent darken-3"
          overlap
          :key="item.id"
          :value="
            item.type === 'audio' && isPlaying && item.src === currentAudioSrc
          "
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
      </single-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "@/main";
import SingleTab from "@/components/content/SingleTab";
import { config } from "../../../config.js";

export default {
  name: "TabBar",
  components: {
    SingleTab,
  },
  data() {
    return {
      config: config,
      active: null,
      pinned: 0,
      pinnedSliderWidth: "90px",
      sliderWidth: "63px",
      count: 100,
      selected: null,
    };
  },
  computed: {
    ...mapGetters([
      "resources",
      "tabs",
      "currentUUID",
      "isPlaying",
      "currentAudioID",
      "audios",
      "completed",
    ]),
    ariaSelectedRule() {
      return {
        "aria-selected-1": true,
      };
    },
    source() {
      return window.player.attributes.src.nodeValue;
    },
    currentAudioSrc() {
      const item = this.resources.filter(
        (a) => a.id === this.currentAudioID
      )[0];
      return item.src;
    },
  },
  methods: {
    icon(item) {
      if (
        item.type === "audio" ||
        item.type === "gallery" ||
        item.type === "timeline"
      ) {
        if (this.completed.includes(item.id)) {
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
        if (this.selected !== id) {
          this.selected = id;
        }
        this.active = id;
        this.pinned = 1;
        // Share state with TabItems component
        eventBus.$emit("updateTab", id);
        // Open Item in ContenList
        eventBus.$emit("openItemByID", id, "no-toggle");
        this.preserveSliderWidth();
        this.shrinkPinnedSliderWidth();
      } else if (id === "pinned") {
        this.active = null;
        this.pinned = 0;
        eventBus.$emit("updateTab", id);
        this.expandPinnedSliderWidth();
      }
    },
    updateTab(id) {
      if (Number.isInteger(id)) {
        this.active = id;
        this.pinned = 1;
      } else if (id === "pinned") {
        this.active = null;
        this.pinned = 0;
        if (this.$refs.tabsSlider) {
          this.$refs.tabsSlider.$el.parentElement.style.minWidth = 0;
        }
      }
    },
    forceReloadTabs() {
      if (this.count === 0) {
        this.count++;
      } else {
        this.count--;
      }
    },
    shrinkPinnedSliderWidth() {
      this.$refs.pinnedTabsSlider.$el.parentElement.style.minWidth = 0;
    },
    expandPinnedSliderWidth() {
      this.$refs.pinnedTabsSlider.$el.parentElement.style.minWidth =
        this.pinnedSliderWidth;
    },
    preserveSliderWidth() {
      this.$refs.tabsSlider.$el.parentElement.style.minWidth = this.sliderWidth;
    },
    resetTabs() {
      this.active = null;
      this.pinned = 0;
      if (this.$refs.tabsSlider)
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
    eventBus.$on("newCompleted", this.forceReloadTabs);
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
.tabs-wrapper {
  height: 48px;
}
.shrunk-tabs {
  width: calc(100% - 90px);
}
</style>