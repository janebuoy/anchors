<template>
  <div id="content">
    <v-card tile flat>
      <v-card-title class="py-4">{{ content.title }}</v-card-title>
    </v-card>
    <v-list three-line class="white">
      <v-list-item-group color="accent" mandatory :value="resourceID">
        <v-list-item v-for="item in resources" :key="item.id">
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
              v-if="item.type === 'audio' && isPlaying && currentAudioID === id"
            >
              mdi-pause
            </v-icon>
            <!-- Show play icon on inactive audio Items -->
            <v-icon
              v-if="item.type === 'audio' && isPlaying && currentAudioID !== id"
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

export default {
  name: "Content",
  data() {
    return {
      resourceID: null,
    };
  },
  computed: {
    ...mapGetters(["content", "resources"]),
  },
};
</script>