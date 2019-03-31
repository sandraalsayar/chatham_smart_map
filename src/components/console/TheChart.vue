<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <div id="basic_info">
      <p>Sea Level: {{ sensor.reading.result }}</p>
      <p>Last Measured: {{ sensor.reading.resultTime }}</p>
    </div>
    <highcharts :options="chartOptions"></highcharts>
  </console-card>
</template>

<script>
import ConsoleCard from "./ConsoleCard";
import { Chart } from "highcharts-vue";

export default {
  components: {
    ConsoleCard,
    highcharts: Chart
  },
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        series: [
          {
            data: [1, 2, 3] // sample data
          }
        ]
      }
    };
  }
};
</script>
