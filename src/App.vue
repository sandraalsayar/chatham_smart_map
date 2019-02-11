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
  addGeocoder,
  getSensorData,
  parseSensorData,
  sensorGeocoder
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
          const framesPerSecond = 15;
          const initialOpacity = 1
          const initialRadius = 6;
          const maxRadius = 15;
          let radius = initialRadius;
          let opacity = initialOpacity;
          const feature = (coordinates, id = '1', loc = 'Savannah, GA', reading = '8ft') => ({
              'type': 'Feature',
              'geometry': {
                  'type': 'Point',
                  coordinates
              },
              'properties': {
                  id,
                  loc,
                  reading
              }
          });
          map.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: sensorGeoJSON
            }
          });

          map.addLayer({
              id: 'point',
              source: 'point',
              type: 'circle',
              paint: {
                  'circle-radius': initialRadius,
                  'circle-radius-transition': {duration: 0},
                  'circle-opacity-transition': {duration: 0},
                  'circle-color': '#007cbf'
              }
          });
          map.addLayer({
              id: 'point1',
              source: 'point',
              type: 'circle',
              paint: {
                  'circle-radius': initialRadius,
                  'circle-color': '#007cbf'
              }
          });
          function animateMarker(timestamp) {
              setTimeout(function(){
                  requestAnimationFrame(animateMarker);
                  radius += (maxRadius - radius) / framesPerSecond;
                  opacity -= ( .9 / framesPerSecond );
                  if (opacity <= 0) {
                      radius = initialRadius;
                      opacity = initialOpacity;
                  }
                  map.setPaintProperty('point', 'circle-radius', radius);
                  map.setPaintProperty('point', 'circle-opacity', opacity);
              }, 1000 / framesPerSecond);
          }
          // Start the animation.
          animateMarker(0);


          // assumes that Geocoder is at index 2, change if more controls are added to the map:
          map._controls[2].options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
        })
        .catch(() => {
          // This will catch ALL errors
          throw Error("Oops!");
        });
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

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 270px;
}
</style>
