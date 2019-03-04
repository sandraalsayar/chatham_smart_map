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
      :thumb-size="140"
      thumb-label
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

export default {
  data () {
    return {
      sliderVal: 0,
      times: [],
      ticksLabels: [],
      maxVal: 12,
      interval: null,
      displayYear: false
    }
  },
  methods: {
    advanceTimelapse () {
      if (this.sliderVal == 12) {
        this.sliderVal = 0
      } else {
        this.sliderVal++
      }
    },
    getThumbLabel (val) {
      const date = new Date(this.times[val])
      const hourLine = format(date, 'h:00 aa')
      let dateLine = ''
      if (this.displayYear) {
        dateLine = format(date, ' M/DD/YYYY')
      } else {
        dateLine = format(date, ' MMMM Do')
      }
      return hourLine.concat(dateLine)
    },
    findTimes (earlyDate, lateDate) { //takes two dates and returns an array of ISO date strings
      const daysDifference = differenceInDays(lateDate, earlyDate)
      const viableDayFractions = [1, 2, 3, 4, 6, 12]
      for (let i = 0; i < viableDayFractions.length; i++){ //splitting days into numbers of hours
        let dayFraction = viableDayFractions[i]
        for (let j = 12; j < 24; j++){ //slitting timelapse bar itself into fractions
          if((daysDifference * dayFraction) % j == 0){
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
      if (earlyDate.getFullYear() != lateDate.getFullYear()) { //determine whether or not the year should be displayed
        this.displayYear = true
      } else {
        this.displayYear = false
      }
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
      } else {
        clearInterval(this.interval)
      }
    })
    eventBus.$on("dates-selected", (earlyDateString, lateDateString) => {
      this.handleNewDates(new Date(earlyDateString), new Date(lateDateString))
      clearInterval(this.interval) // stop pulse
      this.sliderVal = 0 // reset slider
    });
    const today = new Date()
    const yesterday = subDays(today, 1)
    this.handleNewDates(yesterday, today)
  }
}
</script>

<style scoped>
#bar {
  position: fixed;
  right: 70px;
  left: 315px;
  margin-left: 40px;
}
</style>