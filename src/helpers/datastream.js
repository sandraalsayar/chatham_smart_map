import { differenceInMilliseconds } from "date-fns";

export default class Datastream {
  constructor(id, name, unitSymbol) {
    this.id = id;
    this.name = name;
    this.unitSymbol = unitSymbol;
    this.observations = [];
    this.cache = new Map();
  }

  get observationsNavLink() {
    return `https://api.sealevelsensors.org/v1.0/Datastreams(${
      this.id
    })/Observations?$select=result,resultTime&$orderby=resultTime+desc`;
  }

  firstURL(endDate) {
    let link = this.observationsNavLink;
    let minDiff = Infinity;
    for (let [resultTime, curLink] of this.cache.entries()) {
      const diff = differenceInMilliseconds(resultTime, endDate);
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        link = curLink;
      }
    }
    return link;
  }

  addToCache(resultTime, curLink) {
    if (curLink) {
      this.cache.set(resultTime, curLink);
    }
    if (this.cache.size > 50) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}
