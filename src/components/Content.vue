<template>
  <div id="content">
    <TabBar v-if="!$vuetify.breakpoint.smAndDown" />
    <v-tabs-items :value="resourceID" style="overflow-y: auto">
      <v-tab-item v-for="item in resources" :key="item.id" transition="false">
        <ContentList v-show="item.type === 'audio'" />
        <TimelineContent v-if="item.type === 'timeline'" />
      </v-tab-item>
    </v-tabs-items>
    <TabBar
      v-if="$vuetify.breakpoint.smAndDown"
      style="position: fixed; bottom: 0"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "@/main.js";

import TabBar from "@/components/content/TabBar";
import ContentList from "@/components/content/ContentList";
import TimelineContent from "@/components/content/TimelineContent";

export default {
  name: "Content",
  components: {
    TabBar,
    ContentList,
    TimelineContent,
  },
  computed: {
    ...mapGetters(["scenes", "currentUUID", "resources", "currentItem"]),
    numericIcon() {
      const num =
        this.scenes.features.map((a) => a.uuid).indexOf(this.currentUUID) + 1;
      return "mdi-numeric-" + num + "-circle";
    },
    resourceID() {
      if (this.currentItem) {
        return this.currentItem.id;
      } else {
        return 0;
      }
    },
  },
  methods: {
    open(v) {
      eventBus.$emit("openItemByID", v);
    },
  },
};
</script>

<style scoped>
.bottomContent {
  max-height: 388px;
  overflow: auto;
  padding-bottom: 0;
}
</style>