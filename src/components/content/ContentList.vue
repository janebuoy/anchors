<template>
  <v-list three-line class="white mb-16">
    <v-list-item-group color="secondary" mandatory :value="resourceID">
      <v-list-item
        v-for="item in resources"
        :key="item.id"
        @click.stop="openItemByID(item.id, 'no-toggle')"
        :title="
          item.type.charAt(0).toUpperCase() +
          item.type.slice(1) +
          ': ' +
          item.title
        "
      >
        <v-list-item-icon>
          <v-icon>
            {{ icon(item) }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <!-- Show play icon on all non-playing audio Item -->
          <v-icon v-if="item.type === 'audio' && !isPlaying"> mdi-play </v-icon>
          <!-- Show pause icon on active audio Item -->
          <v-icon
            v-if="
              item.type === 'audio' && isPlaying && currentItem.id === item.id
            "
          >
            mdi-pause
          </v-icon>
          <!-- Show play icon on inactive audio Items -->
          <v-icon
            v-if="
              item.type === 'audio' && isPlaying && currentItem.id !== item.id
            "
          >
            mdi-play
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../../main";

export default {
  name: "ContentList",
  computed: {
    ...mapGetters([
      "content",
      "resources",
      "currentItem",
      "tabs",
      "currentUUID",
      "isSubscene",
      "prevAudioID",
      "nextAudioID",
      "isPlaying",
      "audios",
      "currentAudioID",
    ]),
    resourceID() {
      if (this.currentItem) {
        return this.currentItem.id;
      } else {
        return undefined;
      }
    },
  },
  methods: {
    icon(item) {
      if (item.type === "audio") {
        if (
          this.tabs[this.currentUUID].visited.has(item.id) &&
          this.audios[this.currentUUID][this.currentAudioID].progress >= 98 &&
          !this.isPlaying
        ) {
          return "mdi-check-bold";
        } else {
          return item.icon;
        }
      } else {
        if (this.tabs[this.currentUUID].visited.has(item.id)) {
          return "mdi-check-bold";
        } else {
          return item.icon;
        }
      }
    },
    preloadItemByID(id) {
      const item = this.resources.filter((a) => a.id === id)[0];
      if (item !== this.currentItem) {
        this.$store.commit("updateContentItem", item);
      }
    },
    openItemByID(id, string) {
      const item = this.resources.filter((a) => a.id === id)[0];
      if (item !== this.currentItem) {
        this.$store.commit("updateContentItem", item);
      }
      eventBus.$emit("updateTab", item.id);

      switch (item.type) {
        case "audio":
          if (string !== "no-toggle") eventBus.$emit("toggleAudio");
          if (this.isSubscene)
            eventBus.$emit("openSceneDefaults", this.currentUUID);
          break;
        case "map":
          // target is a subScene UUID
          if (item.target) eventBus.$emit("openSubscene", item.target);
          break;
        case "gallery":
          break;
        case "timeline":
          if (item.target) eventBus.$emit("openSubscene", item.target);
          break;
      }
    },
  },
  created() {
    this.preloadItemByID(0);
    eventBus.$on("openItemByID", this.openItemByID);
    eventBus.$on("prevAudio", () => {
      this.openItemByID(this.prevAudioID);
    });
    eventBus.$on("nextAudio", () => {
      this.openItemByID(this.nextAudioID);
    });
  },
  watch: {
    currentUUID() {
      this.preloadItemByID(0);
    },
  },
};
</script>