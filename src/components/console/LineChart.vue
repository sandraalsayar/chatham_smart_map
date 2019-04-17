<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import { format } from "date-fns";

export default {
  components: {
    highcharts: Chart
  },
  props: {
    title: {
      type: String,
      required: true
    },
    unitHtml: {
      type: String,
      required: false,
      default: ""
    },
    series: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    chartOptions() {
      return {
        title: {
          text: this.title,
          style: { fontSize: "14px" }
        },
        xAxis: {
          type: "datetime",
          labels: {
            formatter: function() {
              if (this.isFirst || this.isLast) {
                return format(this.value, "MMM D h:mm a");
              }
            }
          }
        },
        yAxis: {
          title: {
            text: null
          },
          labels: {
            align: "left",
            x: 0,
            y: -2,
            format: `{value}${this.unitHtml}`,
            useHTML: true
          }
        },
        tooltip: {
          crosshairs: true
        },
        legend: {
          enabled: false
        },
        series: this.series,
        plotOptions: {
          series: {
            marker: {
              enabledThreshold: 5,
              symbol: "circle"
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped>
div[data-highcharts-chart] {
  margin-left: 0px;
}
</style>
