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
