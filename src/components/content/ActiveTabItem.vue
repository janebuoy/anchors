<template>
  <v-card flat tile height="100%">
    <v-row class="d-flex" no-gutters>
      <v-card-title style="word-break: normal !important">
        {{ currentItem.title }}
      </v-card-title>
      <v-card-subtitle>{{ currentItem.subtitle }}</v-card-subtitle>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ActiveTabItem",
  computed: {
    ...mapGetters(["currentItem", "isPlaying"]),
  },
  created() {
    console.log(this.currentItem);
  },
};
</script>