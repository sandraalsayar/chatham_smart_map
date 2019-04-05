<template>
  <div>
    <p>Water Level: {{ sensor.waterLevelReading.result }}</p>
    <p>Last Measured: {{ sensor.waterLevelReading.resultTime }}</p>
  </div>
</template>

<script>
export default {
  props: {
    sensor: {
      type: Object,
      required: true
    }
  }
};
</script>
