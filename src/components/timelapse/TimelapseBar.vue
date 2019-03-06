<template>
  <div id = "bar">
    <v-slider
      v-model="sliderVal"
      :tick-labels="ticksLabels"
      :max="maxVal"
      step="1"
      ticks="always"
      tick-size="3"
      color='teal'
      always-dirty
      :thumb-label="thumbLabel"
    >
      <template v-slot:thumb-label="props">
        <span>
          {{ getThumbLabel(sliderVal) }}
        </span>
      </template>
    </v-slider>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import {
  format,
  addHours,
  differenceInDays,
  subDays,
  isToday,
  distanceInWordsToNow
} from "date-fns";
import {
  today,
  startDate
} from "@/helpers/constants"

export default {
  data () {
    return {
      sliderVal: 12,
      times: [],
      ticksLabels: [],
      maxVal: 12,
      interval: null,
      displayYear: false,
      thumbLabel: true
    }
  },
  methods: {
    advanceTimelapse () {
      if (this.sliderVal === this.maxVal) {
        this.sliderVal = 0
      } else {
        this.sliderVal++
      }
    },
    getThumbLabel(val) {
      const date = new Date(this.times[val]);
      return format(
        date,
        this.displayYear ? "h:00 aa M/DD/YYYY" : "h:00 aa MMMM Do"
      );
    },
    findTimes (earlyDate, lateDate) { //takes two dates and returns an array of ISO date strings
      const daysDifference = differenceInDays(lateDate, earlyDate)
      const viableDayFractions = [1, 2, 3, 4, 6, 12]
      for (let dayFraction of viableDayFractions){ //splitting days into numbers of hours
        for (let j = 12; j < 24; j++){ //splitting timelapse bar itself into fractions
          if((daysDifference * dayFraction) % j === 0){
            let workingDate = earlyDate
            let timeArray = []
            for (var k = 0; k <= j; k++) { //populate array of date strings
              timeArray[k] = workingDate.toISOString()
              workingDate = addHours(workingDate, daysDifference/j * 24)
            }
            return timeArray
          }
        }
      }
    },
    generateNewLabels (earlyDate, lateDate) {
      let newLabels = []
      if (isToday(lateDate)) {
        newLabels[0] = distanceInWordsToNow(earlyDate, {addSuffix: true})
        newLabels[this.maxVal] = "Present"
      } else if (this.displayYear) {
        newLabels[0] = format(earlyDate, 'MMMM Do, YYYY')
        newLabels[this.maxVal] = format(lateDate, 'MMMM Do, YYYY')
      } else {
        newLabels[0] = format(earlyDate, 'MMMM Do')
        newLabels[this.maxVal] = format(lateDate, 'MMMM Do')
      }
      return newLabels
    },
    handleNewDates (earlyDate, lateDate) { //whenever the timelapse date range changes, this is called
      this.times = this.findTimes(earlyDate, lateDate) //grab array of dates for the timelapse
      eventBus.$emit("new-timelapse", this.times) // emit the new timelapse intervals to other components
      this.maxVal = this.times.length - 1 //set maxVal for the bar
      this.displayYear = earlyDate.getFullYear() !== lateDate.getFullYear(); //determine whether or not the year should be displayed
      this.ticksLabels = this.generateNewLabels(earlyDate, lateDate) //create new beginning and end labels for the bar
    }
  },
  watch: {
    sliderVal: function() {
      eventBus.$emit("timelapse-pulse", this.sliderVal)
    }
  },
  created () {
    eventBus.$on("toggle-timelapse", (isPlaying) => {
      if(isPlaying) {
        this.interval = setInterval(this.advanceTimelapse, 1000)
        this.thumbLabel = "always";
      } else {
        clearInterval(this.interval)
        this.thumbLabel = true;
      }
    })
    eventBus.$on("dates-selected", (earlyDate, lateDate) => {
      this.handleNewDates(earlyDate, lateDate)
      clearInterval(this.interval) // stop pulse
      this.thumbLabel = true;
      this.sliderVal = 0 // reset slider
    });
    this.handleNewDates(startDate, today)
  },
  mounted: function() {
    // Create an arrow below the v-slider thumb-label
    const node = document.createElement("div");
    node.className = "arrow-down";
    document
      .getElementsByClassName("v-slider__thumb-label__container")[0]
      .appendChild(node);
   }
};
</script>

<style scoped>
#bar {
  margin-left: 30px;
  flex-grow: 1;
}
</style>
