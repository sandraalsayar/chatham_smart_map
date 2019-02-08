<template>
  <mapbox
    :access-token="accessToken"
    :map-options="mapOptions"
    :nav-control="navControl"
    :geolocate-control="geoControl"
    @map-load="mapLoaded"
    @map-error="mapError"
    @geolocate-error="geolocateError"
  >
  </mapbox>
</template>

<script>
import { eventBus } from "../main";
import Mapbox from "mapbox-gl-vue";

import {
  addGeocoder,
  getSensorData,
  parseSensorData,
  sensorGeocoder,
  addSensorLayer
} from "./../helpers/helper";

export default {
  components: {
    Mapbox
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg",
      mapOptions: {
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: { lon: -81.2, lat: 32 },
        zoom: 9.6,
        hash: true
      },
      navControl: {
        show: true,
        position: "bottom-right"
      },
      geoControl: {
        show: true,
        position: "bottom-right"
      }
    };
  },
  methods: {
    mapLoaded(map) {
      eventBus.$emit("show-console");
      addGeocoder(map, this.accessToken);
      getSensorData()
        .then(responses => {
          const sensorGeoJSON = parseSensorData(responses);
          addSensorLayer(map, sensorGeoJSON);
          // assumes that Geocoder is at index 2, change if more controls are added to the map:
          map._controls[2].options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
        })
        .catch(() => {
          // This will catch ALL errors
          eventBus.$emit(
            "warning-alert",
            "We encountered an error while fetching sensor data. You may still use the map."
          );
        })
        .finally(() => {
          eventBus.$emit("stop-loading");
        });
    },
    mapError() {
      eventBus.$emit("stop-loading");
      eventBus.$emit("map-error");
    },
    geolocateError() {
      eventBus.$emit("warning-alert", "We can't seem to locate you right now.");
    }
  }
};
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
