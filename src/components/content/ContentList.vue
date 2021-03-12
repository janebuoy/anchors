<template>
  <v-list three-line class="white mb-16 py-0">
    <v-list-item-group color="secondary" mandatory :value="resourceID">
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
      "prevAudioID",
      "nextAudioID",
      "isPlaying",
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
    openItemByID(id) {
      const item = this.resources.filter((a) => a.id === id)[0];
      if (item !== this.currentItem) {
        this.$store.dispatch("tabID", item.id + 1);
        this.$store.dispatch("updateContentItem", item);
      }
      switch (item.type) {
        case "audio":
          eventBus.$emit("toggleAudio");
          break;
        case "map":
          // target is a subScene UUID
          if (item.target) eventBus.$emit("openSubscene", item.target);
          break;
        case "gallery":
          console.log("gallery");
          break;
        case "timeline":
          if (item.target) eventBus.$emit("openSubscene", item.target);
          break;
      }
    },
  },
  created() {
    eventBus.$on("openItemByID", this.openItemByID);
    eventBus.$on("prevAudio", () => {
      this.openItemByID(this.prevAudioID);
    });
    eventBus.$on("nextAudio", () => {
      this.openItemByID(this.nextAudioID);
    });
  },
};
</script>