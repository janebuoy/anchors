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
import { eventBus } from "../main";

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
      const points = JSON.parse(JSON.stringify(this.scenes.data.features));
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
        let vm = this;
        setInterval(function () {
          // Check if user location is set by LocateControl
          if (vm.mapObject._event && vm.mapObject._event.latlng !== undefined) {
            // Compare the position against all the bounds
            // and open scene if the user has entered a bound that is not that of the current stop
            for (let i = 0; i < vm.stopBounds.length; i++) {
              if (
                vm.stopBounds[i].bounds.contains(vm.mapObject._event.latlng) &&
                vm.stopBounds[i].uuid !== vm.currentUUID &&
                vm.mapObject._active
              ) {
                eventBus.$emit("openScene", vm.stopBounds[i].uuid);
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
    this.active = this.mapObject._active;
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
  color: var(--v-accent-base);
  :hover > & {
    color: var(--v-accent-base);
  }
}
.leaflet-control-locate.active.following a {
  color: var(--v-accent-base);
  :hover > & {
    color: var(--v-accent-base);
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