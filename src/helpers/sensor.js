import { distanceInWordsToNow } from "date-fns";

export default class Sensor {
  constructor(id, coordinates, name, description, observation, elevation) {
    this.id = id;
    this.coordinates = coordinates;
    this.name = `${name} Sensor`;
    this.description = description;
    this.observation = observation;
    this.elevation = elevation;
  }

  get placeName() {
    return `${this.name}, Chatham, GA`;
  }

  get reading() {
    if (this.observation) {

      return {
        result: `${(this.elevation + this.observation.result).toFixed(3)} m`,
        resultTime: distanceInWordsToNow(this.observation.resultTime, {
          addSuffix: true
        })
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
