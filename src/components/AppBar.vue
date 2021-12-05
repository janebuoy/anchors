<template>
  <v-app-bar app dark color="primary" elevate-on-scroll clipped-right>
    <v-app-bar-nav-icon @click="toggleDrawerLeft()"></v-app-bar-nav-icon>
    <v-toolbar-title style="cursor: default">
      {{ content.title }}
    </v-toolbar-title>
    <v-spacer />

    <v-btn @click="openNextScene()">
      {{
        currentUUID === null
          ? config.nextSceneText.start
          : config.nextSceneText.next
      }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";
import { config } from "../../config.js";

export default {
  name: "AppBar",
  data() {
    return {
      config: config,
    };
  },
  computed: {
    ...mapGetters(["scenes", "nextID", "currentUUID", "noOfScenes", "content"]),
  },
  methods: {
    toggleDrawerLeft() {
      this.$store.dispatch("toggleDrawerLeft");
    },
    openNextScene() {
      eventBus.$emit("openNextScene");
    },
  },
};
</script>
