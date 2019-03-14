import axios from "axios";
import encodeUrl from "encodeurl";
import Sensor from "./sensor";
import stringSimilarity from "string-similarity";

let sensors = new Map();

const geocoderMatches = query => {
  const temp = query.toLowerCase();
  return temp
    .split(" ")
    .some(el => stringSimilarity.compareTwoStrings(el, "sensor") > 0.65);
};

const sensorGeocoder = (query, sensorGeoJSON) => {
  const matches = geocoderMatches(query);
  if (!matches) {
    return null;
  }
  return sensorGeoJSON.sort(
    (el1, el2) =>
      stringSimilarity.compareTwoStrings(query, el2.properties.description) -
      stringSimilarity.compareTwoStrings(query, el1.properties.description)
  );
};

const parseSensorData = responses =>
  responses.map(el => {
    const location = el.data.Locations[0];
    const coordinates = location.location.coordinates;
    const name = location.name;

    const description = el.data.description.toLowerCase();
    const observation = el.data.Datastreams[0].Observations[0];
    const id = el.data["@iot.id"];

    const sensor = new Sensor(id, coordinates, name, description, observation);
    sensors.set(id, sensor);

    return sensor.geoJSON;
  });

// Assumes that no sensor has an id of -99
const getPaintProperty = (id = -99) => [
  "case",
  ["==", ["id"], id],
  "#008000",
  "#007cbf"
];

const getSensorData = () => {
  // URL to get ids of all Things that measure water level
  const thingsUrl = encodeUrl(
    "https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id&$filter=Datastreams/name eq 'Water Level'"
  );
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

export {
  geocoderMatches,
  getPaintProperty,
  getSensorData,
  parseSensorData,
  sensorGeocoder,
  sensors
};
