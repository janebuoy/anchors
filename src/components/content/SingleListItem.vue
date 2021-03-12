<template>
  <v-list three-line class="white py-0">
    <v-list-item-group color="secondary" mandatory :value="currentItem.id">
      <v-list-item>
        <v-list-item-icon>
          <v-icon v-text="currentItem.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="currentItem.title"></v-list-item-title>
          <v-list-item-subtitle
            v-text="currentItem.subtitle"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <!-- Show play icon on all non-playing audio Item -->
          <v-icon v-if="currentItem.type === 'audio' && !isPlaying">
            mdi-play
          </v-icon>
          <!-- Show pause icon on active audio Item -->
          <v-icon
            v-if="
              currentItem.type === 'audio' &&
              isPlaying &&
              currentItem.id === currentItem.id
            "
          >
            mdi-pause
          </v-icon>
          <!-- Show play icon on inactive audio Items -->
          <v-icon
            v-if="
              currentItem.type === 'audio' &&
              isPlaying &&
              currentItem.id !== currentItem.id
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
export default {
  name: "SingleListItem",
  computed: {
    ...mapGetters(["currentItem"]),
  },
  created() {
    console.log(this.currentItem);
  },
};
</script>