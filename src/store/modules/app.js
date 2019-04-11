const state = {
  loading: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
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

  updatingData(state, { updatingData }) {
    state.updatingData = updatingData;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
