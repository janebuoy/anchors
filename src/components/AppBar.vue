<template>
  <v-app-bar app dark color="primary" elevate-on-scroll clipped-right>
    <v-app-bar-nav-icon @click="toggleDrawerLeft()"></v-app-bar-nav-icon>
    <v-toolbar-title style="cursor: default">
      {{ content.title }}
    </v-toolbar-title>
    <v-spacer />

    <v-btn @click="openNextScene()">
      {{ nextSceneText }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";

export default {
  name: "AppBar",
  computed: {
    ...mapGetters(["scenes", "nextID", "currentUUID", "noOfScenes", "content"]),
    nextSceneText() {
      const firstSceneUUID = this.scenes.features.find((a) => a.uuid).uuid;
      let text;
      if (this.currentUUID === null) {
        text = "Start";
      } else if (this.currentUUID === firstSceneUUID) {
        text = "Next Scene";
      } else if (this.nextID === this.noOfScenes - 1) {
        text = "Restart";
      } else {
        text = "Next Scene";
      }
      return text;
    },
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
