<template>
  <v-navigation-drawer v-model="drawerLeft" app left style="z-index: 1001">
    <div class="nav-wrapper">
      <v-card
        tile
        dark
        color="neutral darken-4"
        style="font-size: 0.9em"
        elevation="1"
      >
        <v-img src="" aspect-ratio="1.7" contain height="160px">
          <v-btn
            icon
            tile
            x-large
            style="float: right"
            class="d-md-flex d-lg-none closeButton"
            @click.stop="closeDrawer()"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <div class="fill-height bottom-gradient"></div>
        </v-img>
        <v-card-title>Title</v-card-title>
        <v-card-subtitle>Subtitle</v-card-subtitle>
      </v-card>
      <v-list dense>
        <v-list-item-group color="secondary" v-model="activeItem">
          <v-list-item
            link
            v-for="(item, id) in scenes.features"
            :key="item.uuid"
            @click.stop="openScene(item.uuid)"
          >
            <v-list-item-action>
              <v-icon>
                {{ listIcon(id) }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.properties.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
      <span class="px-4 caption font-weight-bold mt-auto">Dev Info</span>
      <span class="px-4 caption">Branch: {{ branch }}</span>
      <span class="px-4 caption">Commit: {{ revision }}</span>
      <v-card
        dark
        tile
        elevation="12"
        color="py-2 neutral darken-4"
        class="nav-actions"
        style="width: 100%"
      >
        <v-row justify="center" class="mt-1 mb-0">
          <v-btn class="mx-2" icon href="">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn class="mx-2" icon href="">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            icon
            href="https://github.com/janebuoy/vue-leaflet-audio-guide"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

import { VUE_APP_GIT_BRANCH } from "@/plugins/git-rev";
import { VUE_APP_GIT_COMMIT_HASH } from "@/plugins/git-rev";
import { eventBus } from "../main";

export default {
  name: "DrawerLeft",
  data() {
    return {
      branch: VUE_APP_GIT_BRANCH,
      revision: VUE_APP_GIT_COMMIT_HASH,
      activeItem: null,
    };
  },
  computed: {
    ...mapGetters(["scenes"]),
    drawerLeft: {
      get() {
        return this.$store.getters.drawerLeft;
      },
      set(v) {
        return this.$store.dispatch("toggleDrawerLeft", v);
      },
    },
  },
  methods: {
    listIcon(id) {
      return "mdi-numeric-" + (id + 1) + "-circle";
    },
    closeDrawer() {
      this.$store.dispatch("toggleDrawerLeft", false);
    },
    openScene(uuid) {
      eventBus.$emit("openScene", uuid);
    },
  },
};
</script>

<style scoped>
.nav-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.nav-actions {
  margin-top: auto;
  height: 56px;
}
.bottom-gradient {
  background-image: linear-gradient(
    to top,
    rgba(46, 42, 49, 0.8) 3%,
    transparent 140px
  );
}
.closeButton {
  background-color: rgba(42, 39, 43, 0.1);
}
</style>