<template>
  <div id="content">
    <v-card tile flat>
      <v-card-title class="py-4">{{ content.title }}</v-card-title>
    </v-card>
    <v-list three-line class="white mb-16">
      <v-list-item-group color="accent" mandatory v-model="resourceID">
        <v-list-item
          v-for="item in resources"
          :key="item.id"
          @click.stop="openItemByID(item.id)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <!-- Show play icon on all non-playing audio Item -->
            <v-icon v-if="item.type === 'audio' && !isPlaying">
              mdi-play
            </v-icon>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";

export default {
  name: "Content",
  data() {
    return {
      resourceID: null,
    };
  },
  computed: {
    ...mapGetters([
      "content",
      "resources",
      "currentItem",
      "prevAudioID",
      "nextAudioID",
      "isPlaying",
    ]),
  },
  methods: {
    openItemByID(id) {
      const item = this.resources.filter((a) => a.id === id)[0];
      // Prevent Update if item equals already stored item
      if (item !== this.currentItem) {
        this.$store.dispatch("updateContentItem", item);
      }
      switch (item.type) {
        case "audio":
          eventBus.$emit("toggleAudio");
          break;
        case "map":
          console.log("map");
          break;
        case "gallery":
          console.log("gallery");
          break;
        case "timeline":
          console.log("timeline");
          break;
      }
    },
    openInitalItem(string) {
      if (this.currentItem === null && string === "created") {
        const item = this.resources.filter((a) => a.id === 0)[0];
        this.$store.dispatch("updateContentItem", item);
      } else if (string === "watch") {
        // open first Item on the list and reset ID to 0
        const item = this.resources.filter((a) => a.id === 0)[0];
        this.resourceID = 0;
        this.$store.dispatch("updateContentItem", item);
      }
    },
  },
  created() {
    // Intial load of first list item, if currentItem is still null
    this.openInitalItem("created");
    eventBus.$on("prevAudio", () => {
      this.openItemByID(this.prevAudioID);
    });
    eventBus.$on("nextAudio", () => {
      this.openItemByID(this.nextAudioID);
    });
  },
  watch: {
    content() {
      this.openInitalItem("watch");
    },
  },
};
</script>