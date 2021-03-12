<template>
  <div id="tabItemsWrapper">
    <v-tabs-items :value="tabID">
      <v-tab-item transition="false">
        <ContentList />
      </v-tab-item>
    </v-tabs-items>
    <v-tabs-items :value="tabID - 1" style="overflow-y: auto">
      <v-tab-item v-for="item in resources" :key="item.id" transition="false">
        <SingleListItem class="flex-grow-0" />
        <TimelineContent v-if="item.type === 'timeline'" />
        <v-spacer />
        <v-btn @click.stop="nextTab" class="mt-auto">Next Content Item</v-btn>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ContentList from "@/components/content/ContentList";
import SingleListItem from "@/components/content/SingleListItem";
import TimelineContent from "@/components/content/TimelineContent";
import { eventBus } from "../../main";

export default {
  name: "Content",
  components: {
    ContentList,
    SingleListItem,
    TimelineContent,
  },
  computed: {
    ...mapGetters([
      "scenes",
      "currentUUID",
      "resources",
      "currentItem",
      "tabID",
    ]),
    numericIcon() {
      const num =
        this.scenes.features.map((a) => a.uuid).indexOf(this.currentUUID) + 1;
      return "mdi-numeric-" + num + "-circle";
    },
  },
  methods: {
    nextTab() {
      eventBus.$emit("openItemByID", this.tabID);
    },
  },
};
</script>