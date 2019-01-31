import axios from "axios";
import encodeUrl from "encodeurl";

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken });
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

const createGeoJSON = coordinates => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates
  }
});

const parseSensorData = responses =>
  responses.map(el => {
    const location = el.data["Locations"][0];
    return createGeoJSON(location.location.coordinates);
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

export { addGeocoder, getSensorData, parseSensorData };
