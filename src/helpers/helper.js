import axios from "axios";
import encodeUrl from "encodeurl";
import Sensor from "./sensor";
import Datastream from "./datastream";
import stringSimilarity from "string-similarity";
import store from "@/store";
import { compareAsc, closestIndexTo } from "date-fns";

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

const parseSensorInformation = responses =>
  responses.map(el => {
    const location = el.Locations[0];
    const coordinates = location.location.coordinates;
    const name = location.name;
    const id = el["@iot.id"];
    const description = el.description.toLowerCase();
    const elevation = Number(el.properties.elevationNAVD88);
    // const observation = el.Datastreams[0].Observations[0];
    const datastreams = el.Datastreams.map(datastream => {
      const id = datastream["@iot.id"];
      const name = datastream.name;
      const unitSymbol = datastream.unitOfMeasurement.symbol;
      return new Datastream(id, name, unitSymbol);
    });

    const sensor = new Sensor(
      id,
      coordinates,
      name,
      description,
      elevation,
      datastreams
    );
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

const getSensorInformation = () => {
  // URL so that we can get relevant information about sensors that have a water level datastream.
  // The information we are looking for involved, sensor ids, locations, names and ids of datastreams they report, elevation etc.
  const url = encodeUrl(`https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id,description,properties&$filter=Datastreams/name eq 'Water Level'&$expand=Datastreams($select=unitOfMeasurement,name,@iot.id),
Locations($select=name,location)`);
  return axios.get(url);
};

const parseSensorData = (
  observations,
  nextLink,
  datastream,
  index,
  times,
  curLink = undefined
) => {
  if (!observations) {
    return;
  }

  let i = 0;
  while (index >= 0 && i < observations.length - 1) {
    const leftComp = compareAsc(times[index], observations[i].resultTime);
    const rightComp = compareAsc(times[index], observations[i + 1].resultTime);
    let matchingIndex = undefined;

    if (!leftComp || (leftComp > 0 && rightComp > 0)) {
      // equals i, or is greater than both
      matchingIndex = i;
    } else if (!rightComp) {
      // equals right, but is less than i
      matchingIndex = i + 1;
    } else if (rightComp > 0) {
      // less than i, greater than right
      matchingIndex =
        i +
        closestIndexTo(times[index], [
          observations[i].resultTime,
          observations[i + 1].resultTime
        ]);
    }

    if (matchingIndex !== undefined) {
      const { result, resultTime } = observations[matchingIndex];
      datastream.observations.push({ result, resultTime });
      datastream.addToCache(resultTime, curLink);
      index--;
    } else {
      i++; // less than both
    }
  }

  if (index >= 0) {
    if (nextLink) {
      axios.get(nextLink).then(res => {
        parseSensorData(
          res.data.value,
          res.data["@iot.nextLink"],
          datastream,
          index,
          times,
          nextLink
        );
      });
    } else {
      while (index >= 0) {
        const { result, resultTime } = observations[i];
        datastream.observations.push({ result, resultTime });
        datastream.addToCache(resultTime, curLink);
        index--;
      }
    }
  }
};

const getSensorData = () => {
  const times = store.getters["timelapse/times"];
  const axiosArr = [];
  const datastreamArr = [];
  for (let sensor of sensors.values()) {
    axiosArr.push(
      ...sensor.datastreams.map(datastream => {
        datastreamArr.push(datastream);
        const url = datastream.firstURL(times[times.length - 1]);
        return axios.get(encodeUrl(url));
      })
    );
  }

  return axios.all(axiosArr).then(responses => {
    responses.forEach((res, i) => {
      const index = times.length - 1;
      parseSensorData(
        res.data.value,
        res.data["@iot.nextLink"],
        datastreamArr[i],
        index,
        times
      );
    });
  });
};

store.watch(
  (state, getters) => getters["timelapse/times"],
  // eslint-disable-next-line no-unused-vars
  _ => {
    getSensorData().catch(() => {
      // This will catch ALL errors
      store.commit("app/showWarning", {
        warningText:
          "We encountered an error while fetching sensor data. You may still use the map."
      });
    });
  }
);

export {
  getPaintProperty,
  getSensorInformation,
  getSensorData,
  parseSensorInformation,
  sensorGeocoder,
  sensors
};
