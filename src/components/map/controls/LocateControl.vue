<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import L, { DomEvent } from "leaflet";
import { findRealParent, propsBinder } from "vue2-leaflet";
import "leaflet.locatecontrol";
import { mapGetters } from "vuex";
import { eventBus } from "@/main";

const props = {
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true,
  },
};
/**
 * From: https://github.com/vUdav/vue2-leaflet-locatecontrol
 * Original author: Valery Liubimov
 *
 * Adapted to fix problem with dependencies:
 * https://github.com/vUdav/vue2-leaflet-locatecontrol/issues/3
 */
export default {
  name: "LocateControl",
  props: props,
  data() {
    return {
      ready: false,
      userLocation: null,
      audioReady: false,
    };
  },
  computed: {
    ...mapGetters([
      "scenes",
      "useActionBounds",
      "actionBoundsRadius",
      "currentUUID",
    ]),
    stopBounds() {
      // Make deep copy to mess with
      const points = JSON.parse(JSON.stringify(this.scenes.features));
      let boundsArr = [];
      for (let i = 0; i < points.length; i++) {
        const coordinates = points[i].geometry.coordinates;
        const bounds = L.latLng(coordinates.reverse()).toBounds(
          this.actionBoundsRadius
        );
        const payload = {
          uuid: points[i].uuid,
          bounds: bounds,
        };
        boundsArr.push(payload);
      }
      return boundsArr;
    },
  },
  methods: {
    enterBounds() {
      // Check if ActionBounds is used (may be able to be changed in settings)
      if (this.useActionBounds) {
        setInterval(() => {
          // Check if user location is set by LocateControl
          if (
            this.mapObject._event &&
            this.mapObject._event.latlng !== undefined
          ) {
            // Compare the position against all the bounds
            // and open scene if the user has entered a bound that is not that of the current stop
            this.userLocation = this.mapObject._event.latlng;
            for (let i = 0; i < this.stopBounds.length; i++) {
              if (
                this.stopBounds[i].bounds.contains(this.userLocation) &&
                this.stopBounds[i].uuid !== this.currentUUID &&
                this.mapObject._active
              ) {
                eventBus.$emit("openScene", this.stopBounds[i].uuid);
                eventBus.$on("audio-player-ready", () => {
                  this.audioReady = true;
                  eventBus.$emit("toggleAudio");
                });
              }
            }
          }
        }, 10000);
      }
    },
  },
  beforeDestroy() {
    this.parentContainer.removeLayer(this);
  },
  mounted() {
    this.mapObject = L.control.locate(this.options);
    DomEvent.on(this.mapObject, this.$listeners);
    propsBinder(this, this.mapObject, props);
    this.ready = true;
    this.parentContainer = findRealParent(this.$parent);
    this.mapObject.addTo(this.parentContainer.mapObject, !this.visible);
    this.enterBounds();
  },
};
</script>

<style lang="scss">
.leaflet-control-locate a {
  font-size: 1.4em;
  color: #444;
  cursor: pointer;
}
.leaflet-control-locate.active a {
  color: var(--v-secondary-base);
  :hover > & {
    color: var(--v-secondary-base);
  }
}
.leaflet-control-locate.active.following a {
  color: var(--v-secondary-base);
  :hover > & {
    color: var(--v-secondary-base);
  }
}
.leafet-control-locate-location circle {
  animation: leaflet-control-locate-throb 4s ease infinite;
}
@keyframes leaflet-control-locate-throb {
  0% {
    r: 9;
    stroke-width: 1;
  }
  50% {
    r: 7;
    stroke-width: 3;
  }
  to {
    r: 9;
    stroke-width: 1;
  }
}
</style>