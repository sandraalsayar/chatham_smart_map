<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <div id="basic_info">
      <p>Sea Level: {{ sensor.reading.result }}</p>
      <p>Last Measured: {{ sensor.reading.resultTime }}</p>
    </div>
  </console-card>
</template>

<script>
import ConsoleCard from "./ConsoleCard";

export default {
  components: { ConsoleCard },
  props: {
    sensor: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
#basic_info {
  margin: 5px;
  margin-left: 0.7em;
  margin-right: 0.7em;
}
</style>
