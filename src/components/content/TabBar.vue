<template>
  <div id="tabsWrapper" class="d-flex">
    <v-tabs
      dark
      background-color="secondary"
      style="max-width: 90px"
      v-model="tabMain"
      optional
      grow
    >
      <v-tabs-slider color="accent"></v-tabs-slider>
      <v-tab
        title="View list"
        @click="onClick(-1, $event)"
        :class="{ 'v-tab--active': selected === 0 }"
        ><v-icon>mdi-view-list</v-icon></v-tab
      >
    </v-tabs>
    <v-tabs
      dark
      background-color="secondary"
      v-model="tabBar"
      optional
      grow
      center-active
      right
      class="shrunk-tabs"
      ref="VTabsBar2"
    >
      <v-tabs-slider color="accent"></v-tabs-slider>
      <v-tab
        v-for="item in resources"
        :key="item.id"
        class="px-1"
        @click="onClick(item.id, $event)"
        :class="{ 'v-tab--active': selected === item.id + 1 }"
      >
        {{ item.id + 1 + "." }}
        <v-icon class="px-2">{{
          visited.has(item.id) ? "mdi-check-bold" : item.icon
        }}</v-icon>
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
      visited: new Set(),
      selected: null,
    };
  },
  computed: {
    ...mapGetters(["resources", "currentItem", "tabID"]),
    tabMain: {
      get() {
        return this.tabID;
      },
      set(v) {
        console.log(v);
        this.$store.dispatch("tabID", v);
      },
    },
    tabBar: {
      get() {
        return this.tabID - 1;
      },
      set(v) {
        if (v !== undefined) {
          this.$store.dispatch("tabID", v + 1);
        }
      },
    },
  },
  methods: {
    onClick(id) {
      this.visited.add(this.selected - 1);
      this.selected = id + 1;
      if (id !== -1) {
        eventBus.$emit("openItemByID", id);
      }
    },
    open(v) {
      if (v !== undefined) {
        this.$store.dispatch("tabID", v + 1);
      }
      // eventBus.$emit("openItemByID", v);
    },
    viewList() {
      this.$store.dispatch("tabID", 0);
    },
    resourceID() {
      if (this.currentItem) {
        return this.currentItem;
      } else {
        return undefined;
      }
    },
  },
};
</script>

<style scoped>
.shrunk-tabs {
  width: calc(100% - 90px);
}
</style>