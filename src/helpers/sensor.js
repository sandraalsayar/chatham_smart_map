import { distanceInWordsToNow, format } from "date-fns";
import store from "@/store";

export default class Sensor {
  constructor(id, coordinates, name, description, elevation, datastreams) {
    this.id = id;
    this.coordinates = coordinates;
    this.name = `${name} Sensor`;
    this.description = description;
    this.elevation = elevation;
    this.datastreams = datastreams;
  }

  get placeName() {
    return `${this.name}, Chatham, GA`;
  }

  get waterLevelReading() {
    if (store.state.app.updatingData) {
      return { result: "Loading...", resultTime: "Loading..." };
    }
    // Find the water level datastream
    const datastream = this.datastreams.find(
      datastream => datastream.name === "Water Level"
    );
    const { observations, unitSymbol } = datastream;
    // observations array is reversed - observations are present in descending order of resultTime,
    // take this into account when we index into it.
    const observation =
      observations[observations.length - 1 - store.state.timelapse.sliderVal];
    if (observation) {
      const result = `${(this.elevation + observation.result).toFixed(
        3
      )} ${unitSymbol}`;
      const resultTime = store.getters["timelapse/present"]
        ? distanceInWordsToNow(observation.resultTime, {
            addSuffix: true
          })
        : format(
            observation.resultTime,
            store.getters["timelapse/displayYear"]
              ? "h:mm aa M/DD/YYYY"
              : "h:mm aa MMMM Do"
          );
      return {
        result,
        resultTime
      };
    } else {
      return {
        resultTime: "N/A",
        result: "No reading"
      };
    }
  }

  // Follows Carmen GeoJSON format:
  get geoJSON() {
    return {
      id: this.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.coordinates
      },
      properties: {
        description: this.description
      },
      place_name: this.placeName,
      place_type: ["place"],
      center: this.coordinates
    };
  }
}
