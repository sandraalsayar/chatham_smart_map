import axios from "axios";
import encodeUrl from "encodeurl";
import stringSimilarity from "string-similarity";

const popupHover = (map) => {
// Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

      map.on('mouseenter', 'point', function(e) {
      // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
        // the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
       
        const html = `
        <h3 class='no_margin_heading'>Sensor ${description}</h3>
        <div>Reading: </div>
        <div>Time: </div>
        `;

        // Populate the popup and set its coordinates.
        popup.setLngLat(coordinates)
        // Need to be replaced with sensor location
        .setHTML(html)
        .addTo(map);
      });

        map.on('mouseleave', 'point', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
}

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken, trackProximity: true });
  map.addControl(geocoder, "top-left");

  let marker;
  geocoder.on("result", function(ev) {
    if (marker) {
      marker.remove();
    }
    marker = new mapboxgl.Marker({
      color: "crimson"
    })
      .setLngLat(ev.result.geometry.coordinates)
      .addTo(map);
  });
  geocoder.on("clear", () => {
    if (marker) {
      marker.remove();
    }
  });
};

const sensorGeocoder = (query, sensorGeoJSON) => {
  const temp = query.toLowerCase();
  const matches = temp.includes("sensor");
  if (!matches) {
    return null;
  }
  return sensorGeoJSON.sort(
    (el1, el2) =>
      stringSimilarity.compareTwoStrings(temp, el2.properties.description) -
      stringSimilarity.compareTwoStrings(temp, el1.properties.description)
  );
};

// Follows Carmen GeoJSON format:
const createGeoJSON = (location, description, readingData) => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: location.location.coordinates
  },
  properties: {
    locationName: location.name,
    description,
    observations: {
      reading: readingData[0].result,
      readingTime: readingData[0].resultTime
    }
  },
  place_name: `${location.name} Sensor, Chatham, GA`,
  place_type: ["place"],
  center: location.location.coordinates
});

const parseSensorData = responses =>
  responses.map(el => {
    const location = el.data.Locations[0];
    let readingData = el.data.Datastreams[0].Observations;
    if (readingData.length === 0) {
      readingData = [{
        resultTime: "N/A",
        result: "No reading"
      }];
    }
    return createGeoJSON(
      location,
      el.data.description.toLowerCase(),
      readingData
    );
  });

const getSensorData = () => {
  // URL to get ids of all Things:
  const thingsUrl =
    "https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id";
  // URL to get the 'Water Level' Datastream and Location data of a particular Thing; we expand the Datastream Observation to obtain the latest reading ('result') using certain query parameters.
  const liveDataUrl = id =>
    encodeUrl(
      `https://api.sealevelsensors.org/v1.0/Things(${id})?
  $expand=Datastreams($filter=name eq 'Water Level';
  $expand=Observations($select=resultTime,result;$orderBy=resultTime desc;$top=1)),
  Locations($select=name,location)`
    );

  return axios.get(thingsUrl).then(response => {
    const urlArr = response.data.value.map(el => liveDataUrl(el["@iot.id"]));
    const axiosArr = urlArr.map(el => axios.get(el));
    return axios.all(axiosArr);
  });
};

const addAndPulsatePoints = (map, sensorGeoJSON) => {
  const framesPerSecond = 15;
  const initialOpacity = 1
  const initialRadius = 6;
  const maxRadius = 15;
  let radius = initialRadius;
  let opacity = initialOpacity;
  map.addSource("inner_point", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: sensorGeoJSON
              }
            });

            map.addLayer({
                id: 'inner_point',
                source: 'inner_point',
                type: 'circle',
                paint: {
                    'circle-radius': initialRadius,
                    'circle-radius-transition': {duration: 0},
                    'circle-opacity-transition': {duration: 0},
                    'circle-color': '#007cbf'
                }
            });
            map.addLayer({
                id: 'outer_point',
                source: 'inner_point',
                type: 'circle',
                paint: {
                    'circle-radius': initialRadius,
                    'circle-color': '#007cbf'
                }
            });
  function animateMarker() {
    setTimeout(function(){
        requestAnimationFrame(animateMarker);
        radius += (maxRadius - radius) / framesPerSecond;
        opacity -= ( .9 / framesPerSecond );
        if (opacity <= 0) {
            radius = initialRadius;
            opacity = initialOpacity;
        }
        map.setPaintProperty('inner_point', 'circle-radius', radius);
        map.setPaintProperty('inner_point', 'circle-opacity', opacity);
    }, 1000 / framesPerSecond);
  }
  animateMarker(0);

};

export { addGeocoder, getSensorData, parseSensorData, sensorGeocoder, addAndPulsatePoints, popupHover };
