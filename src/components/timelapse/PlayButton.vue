<template>
  <div id = "button">
    <v-btn
      color='teal'
      dark
      depressed
      @click="toggle"
    >
      <v-icon 
        v-if="isPlaying"
      >pause</v-icon>
      <v-icon
        v-else
      >play_arrow</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { eventBus } from "@/main";
export default {
  data () {
    return {
      isPlaying: false
    }
  },

  methods: {
    toggle () {
      this.isPlaying = !this.isPlaying
      eventBus.$emit("toggle-timelapse", this.isPlaying)
    }
  }
}
</script>
<style scoped>
.v-btn {
  min-width: 0; /*had to override some properties of v-btn to make it square*/
  min-height: 50px;
}
#button {
  position: fixed;
  bottom: 11px;
  left: 205px;
  margin: 10px;
  padding: 10px;
  border-radius: 3px;
  z-index: 0;
}
</style>
