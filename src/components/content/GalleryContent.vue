<template>
  <v-card width="100%" flat dark tile class="d-flex">
    <v-card-text>
      <v-carousel
        v-model="carouselIndex"
        v-if="currentItem && images && tabItemsHeight"
        :height="
          !$vuetify.breakpoint.smAndDown ? '100%' : tabItemsHeight - 32 + 'px'
        "
        :continuous="false"
        hide-delimiters
        progress
        progress-color="secondary lighten-3"
      >
        <v-carousel-item v-for="image in images" :key="image.id">
          <v-img
            aspect-ratio="1.4"
            :src="image.src"
            :height="
              !$vuetify.breakpoint.smAndDown
                ? '100%'
                : tabItemsHeight - 32 + 'px'
            "
          />
          <div style="position: absolute; bottom: 0; width: 100%">
            <v-card dark tile class="caption" style="width: 100%">
              <v-card-title
                class="subtitle-1"
                style="word-break: normal !important"
              >
                {{ image.title }}
              </v-card-title>
              <v-card-subtitle style="word-break: normal !important">
                {{ image.description }}</v-card-subtitle
              >
            </v-card>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card-text>
    <v-spacer v-if="!$vuetify.breakpoint.smAndDown" class="flex-grow-1" />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "GalleryContent",
  data() {
    return {
      carouselIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["currentItem", "galleries", "tabItemsHeight"]),
    images() {
      if (this.galleries && this.currentItem.type === "gallery") {
        const images = this.galleries.features.filter(
          (a) => a.uuid === this.currentItem.target
        )[0].sources;
        return images;
      } else {
        return undefined;
      }
    },
  },
  watch: {
    carouselIndex(v) {
      if (v === this.images.length - 1) {
        this.$store.dispatch("addCompleted", this.currentItem.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.caption {
  background-color: rgba(36, 33, 38, 0.8);
}
</style>