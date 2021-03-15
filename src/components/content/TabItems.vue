<template>
  <div id="tabItemsWrapper" style="height: 100%">
    <v-tabs-items :value="pinned" reverse>
      <v-tab-transition>
        <v-tab-item>
          <ContentList />
        </v-tab-item>
      </v-tab-transition>
    </v-tabs-items>
    <v-tabs-items :value="active" style="overflow-y: auto">
      <v-tab-item v-for="item in resources" :key="item.id">
        <ActiveTabItem v-if="active === item.id" />
        <timeline-content v-if="item.type === 'timeline'" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../../main";

import ContentList from "@/components/content/ContentList";
import ActiveTabItem from "@/components/content/ActiveTabItem";
import TimelineContent from "./TimelineContent.vue";

export default {
  name: "TabItems",
  components: {
    ContentList,
    ActiveTabItem,
    TimelineContent,
  },
  data() {
    return {
      active: null,
      pinned: 0,
    };
  },
  computed: {
    ...mapGetters(["resources"]),
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
  created() {
    eventBus.$on("updateTab", this.updateTab);
    eventBus.$on("openScene", this.resetTabs);
    eventBus.$on("openNextScene", this.resetTabs);
  },
};
</script>