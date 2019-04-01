<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <div id="basic_info">
      <p>Water Level: {{ sensor.reading.result }}</p>
      <p>Last Measured: {{ sensor.reading.resultTime }}</p>
    </div>
    <div id="water_level_chart">
      <highcharts :options="chartOptions"></highcharts>
    </div>
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
      chart: {
        height: "50%" // doesn't work rn
      },
      chartOptions: {
        title: {
          text: "Water Level Data"
        },
        xAxis: {
          categories: ["1", "2", "3", "4", "5", "6"],
          //tickmarkPlacement: "on",
          crosshair: true,
          plotLines: [
            {
              //color: 'red', // Color value
              value: 3 // Value of where the line will appear
              //width: 2 // Width of the line
            }
          ]
        },
        yAxis: {
          title: {
            text: "Water Level"
          },
          //tickInterval: 0.5,
          tickPixelInterval: 30 // you can also write your own tick interval algo
        },
        series: [
          {
            data: [2, 3, 4, 3.5, 4, 4] // sample data
          }
        ],
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          }
        }
      }
    };
  }
};
</script>

<style scoped>
#basic_info {
  font-size: 16px;
  margin: 5px;
  margin-left: 15px;
  margin-right: 0.7em;
}

/*#water_level_chart {
  height: 150px;
}*/
</style>
