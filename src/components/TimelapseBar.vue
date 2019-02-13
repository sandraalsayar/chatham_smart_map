<template>
  <div id = "bar">
    <v-container
      fluid
      grid-list-lg
    >
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-btn
            color='teal'
            dark
            depressed
            fab
            @click="toggle"
          >
            <v-icon 
              v-if="isPlaying"
              large
            >pause</v-icon>
            <v-icon
              v-else
              large
            >play_arrow</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-slider
            v-model="sliderVal"
            :tick-labels="ticksLabels"
            :max="12"
            step="1"
            ticks="always"
            tick-size="3"
            color='teal'
            always-dirty
          ></v-slider>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isPlaying: false,
        sliderVal: 0,
        ticksLabels: [
          '12 am',
          '2 am',
          '4 am',
          '6 am',
          '8 am',
          '10 am',
          '12 pm',
          '2 pm',
          '4 pm',
          '6 pm',
          '8 pm',
          '10 pm',
          '12 am'
        ]
      }
    },

    methods: {
      toggle () {
        this.isPlaying = !this.isPlaying
      },
      advanceDate () {
        if(this.isPlaying) {
          this.sliderVal++
        }
      }
    }
  }
</script>

<style scoped>
#bar {
  position: fixed;
  bottom: 10px;
  right: 100px;
  width: 1000px;
  margin: 10px;
  padding: 8px 8px;
  border-radius: 3px;
  z-index: 0;
}
</style>