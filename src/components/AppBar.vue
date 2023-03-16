<template>
  <v-app-bar app class="white" flat>
    <v-app-bar-nav-icon @click="toggleDrawerLeft()" class="grey--text text--darken-4"></v-app-bar-nav-icon>
    <v-toolbar-title style="cursor: default" class="grey--text text--darken-4">
      <v-icon class="mt-n1 pr-2 secondary--text">
        {{ listIcon }}
      </v-icon>
      {{ content.title }}
      <span style="font-weight: 300; font-size: 1rem" v-if="currentUUID">
        {{ "(" + (currentItem.id + 1) + "/" + content.resources.length + ")" }}
      </span>
    </v-toolbar-title>
    <v-spacer />

    <v-btn
      @click="openNextScene()"
      class="secondary"
      :title="
        currentUUID === null
          ? config.nextSceneText.start
          : config.nextSceneText.next
      "
      small
    >
      {{
        currentUUID === null
          ? config.nextSceneText.start
          : config.nextSceneText.next
      }}
      <v-icon right class="pr-2" v-if="currentUUID !== null">
        {{ nextIcon }}
      </v-icon>
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
    ...mapGetters([
      "scenes",
      "nextID",
      "currentUUID",
      "noOfScenes",
      "content",
      "currentItem",
    ]),
    listIcon() {
      return "mdi-numeric-" + (this.content.id + 1) + "-circle";
    },
    nextIcon() {
      return this.content.id + 1 === this.noOfScenes
        ? "mdi-numeric-1-circle"
        : "mdi-numeric-" + (this.content.id + 2) + "-circle";
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
