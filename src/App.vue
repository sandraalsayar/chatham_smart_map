<template>
  <div id="app">
    <mapbox
      :access-token="accessToken"
      :map-options="mapOptions"
      @map-init="mapInitialized"
    >
    </mapbox>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

export default {
  name: "app",
  components: { Mapbox },
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
      }
    };
  },
  methods: {
    mapInitialized(map) {
      const geocoder = new MapboxGeocoder({
        accessToken: this.accessToken
      });
      map.addControl(geocoder, "top-left");

      let marker;
      geocoder.on("result", function(ev) {
        if (marker) {
          marker.remove();
        }
        marker = new mapboxgl.Marker()
          .setLngLat(ev.result.geometry.coordinates)
          .addTo(map);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>