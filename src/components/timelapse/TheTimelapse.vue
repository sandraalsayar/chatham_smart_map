<template>
  <div id="timelapse" v-if="timeLapseMode">
    <DatePicker />
    <PlayButton />
    <TimelapseBar />
  </div>
</template>

<script>
import DatePicker from "./DatePicker";
import PlayButton from "./PlayButton";
import TimelapseBar from "./TimelapseBar";
import { mapState } from "vuex";

export default {
  components: {
    DatePicker,
    PlayButton,
    TimelapseBar
  },
  computed: {
    ...mapState("timelapse", ["timeLapseMode"])
  }
};
</script>

<style scoped>
#timelapse {
  position: absolute;
  display: flex;
  bottom: 20px;
  left: 30px;
  right: 80px;
  align-items: center;
}

#timelapse > * {
  display: inline-block;
}
</style>
