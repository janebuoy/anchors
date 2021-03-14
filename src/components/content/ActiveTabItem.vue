<template>
  <v-card flat tile height="100%">
    <v-card-title style="word-break: normal !important">
      {{ currentItem.title }}
    </v-card-title>
    <v-card-subtitle>{{ currentItem.subtitle }}</v-card-subtitle>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ActiveTabItem",
  computed: {
    ...mapGetters(["currentItem", "isPlaying"]),
  },
};
</script>