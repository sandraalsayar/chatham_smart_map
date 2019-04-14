import store from "@/store";
import { yesterday, today } from "@/helpers/constants";
const state = {
  loading: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
  selectedLayer: 0,
  selectedSensor: undefined,
  timelapseMode: false,
  warningText: "",
  updatingData: true
};

const mutations = {
  mapError(state) {
    state.mapError = true;
  },

  showConsole(state) {
    state.mapLoaded = true;
  },

  startLoading(state) {
    state.loading = true;
  },

  stopLoading(state) {
    state.loading = false;
  },

  showWarning(state, { warningText }) {
    state.showWarning = true;
    state.warningText = warningText;
  },

<<<<<<< HEAD
  selectLayer(state, { index }) {
    state.selectedLayer = index;
    mutations.displayTimelapse(state);
  },

  selectSensor(state, { sensor }) {
    state.selectedSensor = sensor;
    mutations.displayTimelapse(state);
  },

  displayTimelapse(state) {
    if (state.selectedLayer !== 0 || state.selectedSensor !== undefined) {
      state.timelapseMode = true;
    } else {
      const startDate = yesterday;
      const endDate = today;
      store.commit("timelapse/setIsPlaying", { isPlaying: false });
      store.commit("timelapse/setSliderVal", { sliderVal: 13 });
      store.commit("timelapse/setDates", { startDate, endDate });
      state.timelapseMode = false;
    }
=======
  updatingData(state, { updatingData }) {
    state.updatingData = updatingData;
>>>>>>> 650a7acb46f70afff8272c363529d8621e6f42f7
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
