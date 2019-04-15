<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  components: {
    highcharts: Chart
  },
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        title: {
          text: `${this.title} Data`
        },
        xAxis: {
          type: "datetime"
        },
        yAxis: {
          title: {
            text: this.title
          }
        },
        legend: {
          enabled: false
        },
        series: [
          {
            name: "USD to EUR",
            data: this.data,
            color: this.color
          }
        ]
      };
    }
  }
};
</script>
