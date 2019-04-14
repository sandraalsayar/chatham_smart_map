import store from "@/store";
import { yesterday, today } from "@/helpers/constants";
const state = {
  loading: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
  layerSelected: 0,
  sensorIsSelected: false,
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

  layerSelected(state, { layerSelected }) {
    state.layerSelected = layerSelected;
  },

  sensorSelected(state, { sensorIsSelected }) {
    state.sensorIsSelected = sensorIsSelected;
  },

  displayTimelapse(state) {
    if (state.layerSelected !== 0 || state.sensorIsSelected) {
      state.timelapseMode = true;
    } else {
      state.timelapseMode = false;
    }
  },

  updatingData(state, { updatingData }) {
    state.updatingData = updatingData;
  }
};

const actions = {
  selectSensor(context, { sensorIsSelected }) {
    context.commit("sensorSelected", { sensorIsSelected });
    context.commit("displayTimelapse");
    let layerSelected = context.state.layerSelected;
    if (!sensorIsSelected && layerSelected === 0) {
      context.dispatch("resetTimelapse");
    }
  },

  selectLayer(context, { layerSelected }) {
    context.commit("layerSelected", { layerSelected });
    context.commit("displayTimelapse");
    let sensorIsSelected = context.state.sensorIsSelected;
    if (!sensorIsSelected && layerSelected === 0) {
      context.dispatch("resetTimelapse");
    }
  },

  resetTimelapse() {
    const startDate = yesterday;
    const endDate = today;
    context.commit("timelapse/setIsPlaying", { isPlaying: false });
    context.commit("timelapse/setSliderVal", { sliderVal: 13 });
    context.commit("timelapse/setDates", { startDate, endDate });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
