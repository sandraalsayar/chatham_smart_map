<template>
  <div id="app">
    <v-app>
      <TheProgressCircle v-if="loadingData" />
      <TheWarningAlert :text="warningText" v-if="showWarning" />
      <TheErrorModal :display="mapError" />
      <TheMap />
      <TheConsole v-if="mapLoaded" />
    </v-app>
  </div>
</template>

<script>
import { eventBus } from "./main";
import TheMap from "./components/TheMap";
import TheConsole from "./components/TheConsole";
import TheProgressCircle from "./components/TheProgressCircle";
import TheWarningAlert from "./components/TheWarningAlert";
import TheErrorModal from "./components/TheErrorModal";

export default {
  name: "app",
  components: {
    TheMap,
    TheConsole,
    TheProgressCircle,
    TheWarningAlert,
    TheErrorModal
  },
  data() {
    return {
      loadingData: true,
      showWarning: false,
      mapError: false,
      mapLoaded: false,
      warningText: ""
    };
  },
  created() {
    eventBus.$on("warning-alert", warningText => {
      this.warningText = warningText;
      this.showWarning = true;
    });
    eventBus.$on("stop-loading", () => {
      this.loadingData = false;
    });
    eventBus.$on("map-error", () => {
      this.mapError = true;
    });
    eventBus.$on("show-console", () => {
      this.mapLoaded = true;
    });
  }
};
</script>

<style>
#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 270px;
}
</style>
