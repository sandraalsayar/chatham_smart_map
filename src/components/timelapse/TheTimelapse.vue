<template>
  <div id="timelapse">
    <DatePicker />
    <PlayButton />
    <TimelapseBar />
  </div>
</template>

<script>
import DatePicker from "./DatePicker";
import PlayButton from "./PlayButton";
import TimelapseBar from "./TimelapseBar";

export default {
  components: {
    DatePicker,
    PlayButton,
    TimelapseBar
  }
};
</script>

<style scoped>
#timelapse {
  position: absolute;
  bottom: 32px;
  left: 50px;
}

#timelapse > * {
  display: inline-block;
}
</style>
