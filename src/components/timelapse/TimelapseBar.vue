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
      <span slot="thumb-label" slot-scope="help">{{getThumbLabel(sliderVal)}}</span>
<!--       <template v-slot:thumb-label="props">
        <span>
          {{ getThumbLabel(props.value) }}
        </span>
      </template> -->
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
      var date = new Date(this.times[val])
      var hourLine = format(date, 'h:00 aa')
      var dateLine = ''
      if (this.displayYear) {
        dateLine = format(date, ' M/DD/YYYY')
      } else {
        dateLine = format(date, ' MMMM Do')
      }
      return hourLine.concat(dateLine)
    },
    findTimes (earlyDate, lateDate) { //takes two dates and returns an array of ISO date strings
      var daysDifference = differenceInDays(lateDate, earlyDate)
      var viableDayFractions = [1, 2, 3, 4, 6, 12]
      for (var i = 0; i < viableDayFractions.length; i++){ //splitting days into numbers of hours
        var dayFraction = viableDayFractions[i]
        for (var j = 12; j < 24; j++){ //slitting timelapse bar itself into fractions
          if((daysDifference * dayFraction) % j == 0){
            var workingDate = earlyDate
            var timeArray = []
            for (var k = 0; k <= j; k++) { //populate array of date strings
              timeArray[k] = workingDate.toISOString()
              workingDate = addHours(workingDate, daysDifference/j * 24)
            }
            return timeArray
          }
        }
      }
    },
    handleNewDates (earlyDate, lateDate) { //whenever the timelapse date range changes, this is called
      this.times = this.findTimes(earlyDate, lateDate) //grab array of dates for the timelapse
      /*
        add new eventBus emitter here to broadcast this.times
      */
      this.maxVal = this.times.length - 1 //set maxVal for the bar
      if (earlyDate.getFullYear() != lateDate.getFullYear()) { //determine whether or not the year should be displayed
        this.displayYear = true
      } else {
        this.displayYear = false
      }
      var newLabels = [] //create new beginning and end labels for the bar
      if (isToday(lateDate)) {
        newLabels[0] = distanceInWordsToNow(earlyDate).concat(" ago")
        newLabels[this.maxVal] = "Present"
      } else if (this.displayYear) {
        newLabels[0] = format(earlyDate, 'MMMM Do, YYYY')
        newLabels[this.maxVal] = format(lateDate, 'MMMM Do, YYYY')
      } else {
        newLabels[0] = format(earlyDate, 'MMMM Do')
        newLabels[this.maxVal] = format(lateDate, 'MMMM Do')
      }
      this.ticksLabels = newLabels
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
    /*
    create new listener here
    ex:
    eventBus.$on("newDatesForTimelapse", (earlyDateString, lateDateString) => {
      this.handleNewDates(new Date(earlyDateString), new Date(lateDateString))
      clearInterval(this.interval) // stop pulse
      this.sliderVal = 0 // reset slider
    }
    see similar block in handleNewDates above and in created() in the PlayButton component
    */
    var today = new Date()
    var yesterday = subDays(today, 1)
    this.handleNewDates(yesterday, today)
  }
}
</script>

<style scoped>
#bar {
  position: fixed;
  bottom: 84px;
  right: 60px;
  left: 310px;
  height: 0px;
  margin: 10px;
  border-radius: 3px;
  z-index: 0;
}
</style>