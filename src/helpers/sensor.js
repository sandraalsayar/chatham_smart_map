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
    const datastream = this.datastreams.find(
      datastream => datastream.name === "Water Level"
    );
    // Array is reversed
    const { observations, unitSymbol } = datastream;
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
              ? "M/DD/YYYY h:mm aa"
              : "MMMM Do h:mm aa"
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
