const state = {
  loadingData: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
  warningText: ""
};

const mutations = {
  mapError(state) {
    state.mapError = true;
  },

  showConsole(state) {
    state.mapLoaded = true;
  },

  stopLoading(state) {
    state.loadingData = false;
  },

  showWarning(state, { warningText }) {
    state.showWarning = true;
    state.warningText = warningText;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
