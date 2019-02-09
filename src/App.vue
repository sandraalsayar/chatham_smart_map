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


      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
       
      map.on('mouseenter', 'point', function(e) {
      // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
        // the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
       
      // Populate the popup and set its coordinates.
        popup.setLngLat(coordinates)
        // Need to be replaced with sensor location
        .setHTML("<h3>Sensor</h3>" +
          "<body>Reading: <br></body>" +
          "<body>Time: </body>")
        .addTo(map);
      });
       
      map.on('mouseleave', 'point', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
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
.mapboxgl-popup-tip {
  border: 0px;
}

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 270px;
}
</style>
