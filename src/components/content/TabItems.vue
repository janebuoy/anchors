<template>
  <v-tabs-items :value="resourceID" style="overflow-y: auto">
    <v-tab-item v-for="item in resources" :key="item.id" transition="false">
      <ContentList v-show="item.type === 'audio'" />
      <TimelineContent v-if="item.type === 'timeline'" />
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "@/main.js";

//import TabBar from "@/components/content/TabBar";
import ContentList from "@/components/content/ContentList";
import TimelineContent from "@/components/content/TimelineContent";

export default {
  name: "Content",
  components: {
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