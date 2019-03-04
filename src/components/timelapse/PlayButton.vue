<template>
  <v-btn color="teal" dark depressed @click="toggle">
    <v-icon v-if="isPlaying">pause</v-icon>
    <v-icon v-else>play_arrow</v-icon>
  </v-btn>
</template>
<script>
import { eventBus } from "@/main";
export default {
  data() {
    return {
      isPlaying: false
    };
  },

  methods: {
    toggle() {
      this.isPlaying = !this.isPlaying;
      eventBus.$emit("toggle-timelapse", this.isPlaying);
    }
  },

  created() {
    /*
    create new listener here
    ex:
    eventBus.$on("newDatesForTimelapse", () => {
      this.isPlaying = false // pause the button (the bar has already been paused in TimeLapseBar)
    }
    */
  }
};
</script>
<style scoped>
.v-btn {
  min-width: 0px; /* had to override some properties of v-btn to make it square */
  min-height: 50px;
  border-radius: 3px;
}
</style>
