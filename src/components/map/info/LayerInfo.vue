<template>
  <l-control position="topright">
    <span class="info-text mr-1">
      {{ items[this.active].props.categoryName }}
    </span>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import { eventBus } from "@/main";

export default {
  name: "LayerInfo",
  props: ["properties"],
  components: {
    LControl,
  },
  data() {
    return {
      active: 0,
      show: false,
    };
  },
  computed: {
    items() {
      let result = [];
      for (const feature of this.properties.features) {
        result.push({
          props: {
            categoryID: feature.properties.categoryID,
            categoryName: feature.properties.categoryName,
            targetUUID: feature.properties.targetUUID,
          },
        });
      }
      const items = [...new Set(result.map(JSON.stringify))].map(JSON.parse);
      return items;
    },
  },
  created() {
    eventBus.$on("switchLayer", (e) => {
      this.active = e;
    });
  },
};
</script>

<style lang="scss" scoped>
.info-text {
  font-weight: 800;
  font-family: "Roboto", sans-serif;
  font-size: 3rem;
  line-height: 1;
  text-shadow: 2px 2px 2px white;
  color: rgba(0, 0, 0, 0.8);
}
</style>