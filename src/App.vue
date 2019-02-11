<template>
  <div id="app">
    <mapbox
      :access-token="accessToken"
      :map-options="mapOptions"
      :nav-control="navControl"
      :geolocate-control="geoControl"
      @map-init="mapInitialized"
      @map-load="mapLoaded"
    >
    </mapbox>
    <TheConsole />
  </div>
</template>

<script>
import Mapbox from "mapbox-gl-vue";
import TheConsole from "./components/TheConsole";
import {
  popupHover,
  addGeocoder,
  getSensorData,
  parseSensorData,
  sensorGeocoder,
  addAndPulsatePoints
} from "./helpers/helper";

export default {
  name: "app",
  components: {
    Mapbox,
    TheConsole
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
    mapInitialized(map) {
      addGeocoder(map, this.accessToken);
    },
    mapLoaded(map) {
      getSensorData()
        .then(responses => {
          const sensorGeoJSON = parseSensorData(responses);
           addAndPulsatePoints(map, sensorGeoJSON);
          // assumes that Geocoder is at index 2, change if more controls are added to the map:
          map._controls[2].options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
        })
        .catch(() => {
          // This will catch ALL errors
          throw Error("Oops!");
        });
        popupHover(map);
    }
  }
};
</script>
<style>
#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

/* Card poopup for sensors */
.mapboxgl-popup-tip {
  border: 0px;
}

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 270px;
}
</style>
