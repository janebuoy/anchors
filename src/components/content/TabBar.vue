<template>
  <v-tabs
    dark
    :value="resourceID"
    background-color="secondary"
    @change="open"
    centered
  >
    <v-tabs-slider color="accent"></v-tabs-slider>
    <v-tab
      v-for="item in resources"
      :key="item.id"
      class="px-1"
      :style="{ minWidth: 90 + 'px' }"
    >
      {{ item.id + 1 }}
      <v-icon class="px-2">{{ item.icon }}</v-icon>
    </v-tab>
  </v-tabs>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../../main";
export default {
  name: "TabBar",
  computed: {
    ...mapGetters(["resources", "currentItem"]),
    resourceID() {
      if (this.currentItem) {
        return this.currentItem.id;
      } else {
        return undefined;
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