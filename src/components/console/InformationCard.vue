<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <div id="basic_info">
      <PopupContent :sensor="sensor" />
    </div>
    <div id="water_level_chart">
      <highcharts
        :options="chartOptions"
        :constructor-type="stockChart"
      ></highcharts>
      <highcharts
        :options="chartOptions"
        :constructor-type="stockChart"
      ></highcharts>
      <highcharts
        :options="chartOptions"
        :constructor-type="stockChart"
      ></highcharts>
    </div>
  </console-card>
</template>

<script>
import ConsoleCard from "./ConsoleCard";
import PopupContent from "@/components/PopupContent";
import { Chart } from "highcharts-vue";

export default {
  components: {
    ConsoleCard,
    PopupContent,
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
        title: {
          text: "Sea Level Data"
        },
        xAxis: {
          categories: ["1", "2", "3", "4"],
          crosshair: true
        },
        yAxis: {
          title: {
            text: "Sea Level"
          },
          plotLines: [
            {
              color: "#FF0000", // Color value
              value: 2, // Value of where the line will appear
              width: 2 // Width of the line
            }
          ],
          tickPixelInterval: 30 // you can also write your own tick interval algo
        },
        series: [
          {
            data: [1.36, 2.07, 1.55, 0.78] // sample data
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
