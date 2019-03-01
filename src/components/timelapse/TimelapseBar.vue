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
      :thumb-size="60"
      thumb-label
    >
      <span slot="thumb-label" slot-scope="{value}">{{times[sliderVal]}}</span>
    </v-slider>
  </div>
</template>

<script>
import { eventBus } from "@/main";
export default {
  data () {
    return {
      sliderVal: 0,
      times: [],
      ticksLabels: [],
      maxVal: 12,
      interval: null
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
    hourString (hours) {
      var pm = false
      if (hours >= 12) {
        pm = true
        hours -= 12
      }
      var tailString = ""
      if (pm) {
        tailString = ":00 pm"
      } else {
        tailString = ":00 am"
      }
      if (hours == 0) {
        hours = 12
      }
      return String(hours) + tailString 
    }
  },
  watch: {
    sliderVal: function() {
      eventBus.$emit("timelapse-pulse", this.sliderVal)
    }
  },
  created() {
    eventBus.$on("toggle-timelapse", (isPlaying) => {
      if(isPlaying) {
        this.interval = setInterval(this.advanceTimelapse, 1000)
      } else {
        clearInterval(this.interval)
      }
    })
    this.ticksLabels[0] = "24 hours ago"
    this.ticksLabels[12] = "Present"
    var today = new Date()
    var hours = today.getHours()
    if (today.getMinutes() >= 30) {
      hours++
    }
    for (var i = 0; i < this.maxVal + 1; i++){
      if (hours >= 24) {
        hours -= 24
      }
      this.times[i] = this.hourString(hours)
      hours += 2
      console.log(this.hourString(hours))
    }
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