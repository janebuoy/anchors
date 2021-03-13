<template>
  <div id="tabsWrapper" class="d-flex">
    <v-tabs
      :value="pinned"
      slider-color="accent"
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
      slider-color="accent"
      dark
      background-color="secondary"
      optional
      center-active
      right
      class="shrunk-tabs"
      ref="VTabsBar2"
    >
      <v-tab
        v-for="item in resources"
        :key="item.id"
        class="px-1"
        @click.stop="openTab(item.id, $event)"
        style="min-width: 60px"
        :class="{ 'v-tab--active': selected === item.id + 1 }"
      >
        <span class="pl-2">{{ item.id + 1 + "." }}</span>
        <v-icon class="pr-2">
          {{
            tabs[currentUUID].visited.has(item.id)
              ? "mdi-check-bold"
              : item.icon
          }}
        </v-icon>
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
      selected: null,
    };
  },
  computed: {
    ...mapGetters([
      "scenes",
      "resources",
      "currentItem",
      "tabs",
      "currentUUID",
    ]),
  },
  methods: {
    openTab(id) {
      if (Number.isInteger(id)) {
        this.active = id;
        this.pinned = 1;
        eventBus.$emit("updateTab", id);
        eventBus.$emit("openItemByID", id);
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
      }
    },
  },
  created() {
    eventBus.$on("updateTab", this.updateTab);
  },
};
</script>

<style scoped>
.shrunk-tabs {
  width: calc(100% - 90px);
}
</style>