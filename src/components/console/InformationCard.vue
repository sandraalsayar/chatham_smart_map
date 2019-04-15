<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <PopupContent :sensor="sensor" />
    <LineChart
      v-for="(datastream, index) in chartDatastreams"
      :key="index"
      :title="datastream.name"
      :color="datastream.color"
      :data="datastream.data"
    />
  </console-card>
</template>

<script>
import ConsoleCard from "./ConsoleCard";
import PopupContent from "@/components/PopupContent";
import LineChart from "./LineChart";

export default {
  components: {
    ConsoleCard,
    PopupContent,
    LineChart
  },
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartDatastreams() {
      let waterlevelIndex = -1;
      const datastreams = this.sensor.datastreams.map((datastream, index) => {
        const { name, color, observations } = datastream;

        if (name === "Water Level") {
          waterlevelIndex = index;
        }

        const data = observations.reduce((filtered, observation) => {
          if (observation) {
            const x = new Date(observation.resultTime).getTime();
            const y = observation.result;
            filtered.push({ x, y });
          }
          return filtered;
        }, []);
        data.reverse();

        return { name, color, data };
      });
      const el = datastreams.splice(waterlevelIndex, 1);
      datastreams.unshift(el[0]); // ensure that water level is the first graph
      return datastreams;
    }
  }
};
</script>
