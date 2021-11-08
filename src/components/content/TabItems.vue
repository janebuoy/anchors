<template>
  <div ref="tabItemsWrapper" style="height: 100%" v-if="mounted">
    <v-tabs-items
      v-show="pinned === 0"
      :value="pinned"
      reverse
      style="height: 100%; overflow-y: auto"
    >
      <v-tab-transition>
        <v-tab-item>
          <ContentList />
        </v-tab-item>
      </v-tab-transition>
    </v-tabs-items>

    <div style="height: 100%" v-if="pinned !== 0">
      <v-tabs-items :value="active" style="overflow-y: auto; height: 100%">
        <v-tab-item
          v-for="item in resources"
          :key="item.id"
          :style="!$vuetify.breakpoint.smAndDown ? 'height: 100%' : null"
        >
          <active-tab-item
            v-if="item.type === 'audio' || item.type === 'map'"
          />
          <gallery-content
            v-if="item.type === 'gallery'"
            :style="!$vuetify.breakpoint.smAndDown ? 'height: 100%' : null"
          />
          <timeline-content v-if="item.type === 'timeline'" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "@/main";

import ContentList from "@/components/content/ContentList";
import GalleryContent from "@/components/content/GalleryContent.vue";
import TimelineContent from "./TimelineContent.vue";
import ActiveTabItem from "./ActiveTabItem.vue";

export default {
  name: "TabItems",
  components: {
    ContentList,
    GalleryContent,
    TimelineContent,
    ActiveTabItem,
  },
  data() {
    return {
      active: null,
      pinned: 0,
      mounted: false,
    };
  },
  computed: {
    ...mapGetters(["resources", "tabs", "currentUUID", "currentItem"]),
    windowHeight() {
      return this.$vuetify.breakpoint.height;
    },
  },
  methods: {
    updateTab(id) {
      if (Number.isInteger(id)) {
        this.active = id;
        this.pinned = 1;
      } else {
        this.active = -1;
        this.pinned = 0;
      }
    },
    resetTabs() {
      this.active = null;
      this.pinned = 0;
    },
  },
  mounted() {
    this.active = this.tabs[this.currentUUID].active;
    this.pinned = this.tabs[this.currentUUID].pinned;
    this.mounted = true;
    this.$nextTick(() => {
      this.$store.commit(
        "tabItemsHeight",
        this.$refs.tabItemsWrapper.offsetHeight
      );
    });
  },
  created() {
    eventBus.$on("updateTab", this.updateTab);
    eventBus.$on("openScene", this.resetTabs);
    eventBus.$on("openNextScene", this.resetTabs);
  },
  watch: {
    windowHeight() {
      this.$store.commit(
        "tabItemsHeight",
        this.$refs.tabItemsWrapper.offsetHeight
      );
    },
  },
};
</script>