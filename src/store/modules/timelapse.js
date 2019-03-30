import { yesterday, today } from "@/helpers/constants";
import {
  addHours,
  format,
  isToday,
  differenceInDays,
  distanceInWordsToNow
} from "date-fns";

const state = {
  startDate: yesterday,
  endDate: today,
  isPlaying: false,
  sliderVal: 12,
  thumbLabel: true
};

const mutations = {
  setDates(state, { startDate, endDate }) {
    state.startDate = startDate;
    state.endDate = endDate;
  },
  setIsPlaying(state, { isPlaying }) {
    state.isPlaying = isPlaying;
  },
  toggleIsPlaying(state) {
    state.isPlaying = !state.isPlaying;
  },
  setSliderVal(state, { sliderVal }) {
    state.sliderVal = sliderVal;
  },
  setThumbLabel(state, { thumbLabel }) {
    state.thumbLabel = thumbLabel;
  }
};

const getters = {
  times({ startDate, endDate }) {
    //takes two dates and returns an array of ISO date strings
    const daysDifference = differenceInDays(endDate, startDate);
    const viableDayFractions = [1, 2, 3, 4, 6, 12];
    for (let dayFraction of viableDayFractions) {
      //splitting days into numbers of hours
      for (let j = 12; j < 24; j++) {
        //splitting timelapse bar itself into fractions
        if ((daysDifference * dayFraction) % j === 0) {
          let workingDate = startDate;
          let timeArray = [];
          for (let k = 0; k <= j; k++) {
            //populate array of date strings
            timeArray[k] = workingDate.toISOString();
            workingDate = addHours(workingDate, (daysDifference / j) * 24);
          }
          return timeArray;
        }
      }
    }
  },
  maxVal(state, getters) {
    return getters.times.length - 1;
  },
  displayYear({ startDate, endDate }) {
    startDate.getFullYear() !== endDate.getFullYear();
  },
  ticksLabels({ startDate, endDate }, { maxVal, displayYear }) {
    let newLabels = [];
    if (isToday(endDate)) {
      newLabels[0] = distanceInWordsToNow(startDate, { addSuffix: true });
      newLabels[maxVal] = "Present";
    } else {
      newLabels[0] = format(
        startDate,
        displayYear ? "MMMM Do, YYYY" : "MMMM Do"
      );
      newLabels[maxVal] = format(
        endDate,
        displayYear ? "MMMM Do, YYYY" : "MMMM Do"
      );
    }
    return newLabels;
  },
  getThumbLabel: (state, { times, displayYear }) => val => {
    return format(
      times[val],
      displayYear ? "h:00 aa M/DD/YYYY" : "h:00 aa MMMM Do"
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
