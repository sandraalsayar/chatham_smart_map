<template>
  <div id="console">
    <div style="height: 48px;"></div>
    <ConsoleLayersList />
    <div style="height: 6px;"></div>
    <ConsoleLegend />
    <div style="height: 6px;"></div>
    <InformationCard :sensor="infoCardSensor" v-if="infoCardVisible" />
  </div>
</template>

<script>
import { eventBus } from "@/main";
import ConsoleLayersList from "./ConsoleLayersList";
import ConsoleLegend from "./ConsoleLegend";
import InformationCard from "./InformationCard";

export default {
  components: {
    ConsoleLayersList,
    ConsoleLegend,
    InformationCard
  },
  data() {
    return {
      infoCardVisible: false,
      infoCardSensor: undefined
    };
  },
  created() {
    eventBus.$on("sensor-clicked", (selected, sensor) => {
      this.infoCardSensor = sensor;
      this.infoCardVisible = selected;
    });
  }
};
</script>

<style scoped>
#console {
  position: absolute;
  width: 286px;
  margin: 10px;
  padding: 8px 8px;
  background-color: rgb(225, 225, 225);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 3px;
  z-index: 0;
}
</style>
