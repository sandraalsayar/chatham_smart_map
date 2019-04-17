import { distanceInWordsToNow, format } from "date-fns";
import store from "@/store";

export default class Sensor {
  constructor(id, coordinates, name, description, datastreams) {
    this.id = id;
    this.coordinates = coordinates;
    this.name = `${name} Sensor`;
    this.description = description;
    this.datastreams = datastreams;
  }

  get placeName() {
    return `${this.name}, Chatham, GA`;
  }

  get chartDatastreams() {
    if (store.state.app.updatingData) {
      return [{ title: "Loading chart data..." }];
    }

    return this.datastreams.map(datastream => {
      const { name, color, observations, unitHtml } = datastream;
      let series = [];
      let data = [];
      observations.forEach(observation => {
        if (observation) {
          const x = new Date(observation.resultTime).getTime();
          const y = observation.result;
          data.push({ x, y });
        } else if (data.length) {
          data.reverse();
          series.push({ data, color, name });
          data = [];
        }
      });
      if (data.length) {
        data.reverse();
        series.push({ data, color, name });
      }
      const title = series.length
        ? `${name} Data`
        : `No ${name} data available in selected time interval`;

      return { title, series, unitHtml };
    });
  }

  get waterLevelReading() {
    if (store.state.app.updatingData) {
      return { result: "Loading...", resultTime: "Loading..." };
    }
    // We made sure that water level was the first datastream:
    const { observations, unitSymbol } = this.datastreams[0];
    // observations array is reversed - observations are present in descending order of resultTime,
    // take this into account when we index into it.
    const observation =
      observations[observations.length - 1 - store.state.timelapse.sliderVal];
    if (observation) {
      const result = `${observation.result} ${unitSymbol}`;
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
