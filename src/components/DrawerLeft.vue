<template>
  <v-navigation-drawer
    v-model="drawerLeft"
    left
    style="z-index: 1001"
    @transitionend="mapInvalidate"
    app
  >
    <div class="nav-wrapper">
      <v-card
        tile
        dark
        color="neutral darken-4"
        style="font-size: 0.9em"
        elevation="1"
      >
        <v-img
          src="data/images/title_img_001.jpg"
          aspect-ratio="1.7"
          height="160px"
        >
          <div class="fill-height bottom-gradient"></div>
        </v-img>
        <v-card-title style="font-size: 1.1em">
          {{ config.app.title }}
        </v-card-title>
        <v-card-subtitle> {{ config.app.subtitle }} </v-card-subtitle>
      </v-card>
      <v-list dense>
        <v-list-item-group color="secondary" :value="activeItem" mandatory>
          <v-list-item
            link
            v-for="(item, index) in scenes.features"
            :key="item.uuid"
            @click.stop="openScene(item.uuid)"
            two-line
          >
            <v-list-item-action>
              <v-icon :color="index !== activeItem ? 'neutral' : null">
                {{ listIcon(index) }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                :class="index !== activeItem ? 'de-emphasize' : null"
              >
                {{ item.content.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-icon x-small> mdi-map-marker </v-icon>
                {{ item.properties.title }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
      <!-- <span class="px-4 caption font-weight-bold mt-auto">Dev Info</span>
      <span class="px-4 caption">Branch: {{ branch }}</span>
      <span class="px-4 caption">Commit: {{ revision }}</span> -->
      <v-card
        dark
        tile
        elevation="12"
        color="py-2 neutral darken-4"
        class="nav-actions"
        style="width: 100%"
      >
        <v-row justify="center" class="mt-1 mb-0">
          <v-btn class="mx-2" icon :href="config.websiteLink">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn class="mx-2" icon :href="config.twitterLink">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn class="mx-2" icon :href="config.repoLink">
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
import { config } from "../../config.js";

export default {
  name: "DrawerLeft",
  data() {
    return {
      config: config,
      branch: VUE_APP_GIT_BRANCH,
      revision: VUE_APP_GIT_COMMIT_HASH,
    };
  },
  computed: {
    ...mapGetters(["scenes", "currentUUID"]),
    drawerLeft: {
      get() {
        return this.$store.getters.drawerLeft;
      },
      set(v) {
        return this.$store.dispatch("toggleDrawerLeft", v);
      },
    },
    activeItem() {
      return this.scenes.features.findIndex((a) => a.uuid === this.currentUUID);
    },
  },
  methods: {
    mapInvalidate() {
      eventBus.$emit("mapInvalidate", { pan: false });
    },
    listIcon(index) {
      return "mdi-numeric-" + (index + 1) + "-circle";
    },
    closeDrawer() {
      this.$store.dispatch("toggleDrawerLeft", false);
    },
    openScene(uuid) {
      eventBus.$emit("openScene", uuid);
      this.closeDrawer();
    },
  },
  created() {
    console.log("Branch: ", this.branch);
    console.log("Commit: ", this.config.repoLink + "/commit/" + this.revision);
  },
};
</script>

<style scoped lang="scss">
.nav-wrapper {
  height: 100%;
  height: -webkit-fill-available;
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
.de-emphasize {
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.6);
}
::v-deep .v-list-item__title {
  font-size: 0.9rem !important;
}
</style>