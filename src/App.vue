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

          map.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: sensorGeoJSON
            }
          });

          map.addLayer({
            id: "point",
            source: "point",
            type: "circle",
            paint: {
              "circle-radius": 6,
              "circle-radius-transition": { duration: 0 },
              "circle-opacity-transition": { duration: 0 },
              "circle-color": "#007cbf"
            }
          });
          // assumes that Geocoder is at index 2, change if more controls are added to the map:
          map._controls[2].options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
        })
        .catch(() => {
          // This will catch ALL errors
          throw Error("Oops!");
        });


        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'point', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;
           
          // Ensure that if the map is zoomed out such that multiple copies of the feature
          // are visible, the popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
           
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });
           
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'point', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
           
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'point', function () {
          map.getCanvas().style.cursor = '';
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

/* Card poopup for sensors */
.mapboxgl-popup {
  max-width: 400px;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 270px;
}
</style>
