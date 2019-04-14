import store from "@/store";
const state = {
  layers: [
    {
      name: "Sensors",
      color: "steelblue",
      description: "Display water sensors on map.",
      icon: "bubble_chart",
      selected: true,
      legend_html: `<div class="label" id="sensor"></div>
      <p class="label" style="font-size:16px">Water level sensors</p>`,
      legend_displayed: true
    },
    {
      name: "Inundation",
      color: "dodgerblue",
      description: "Display altitude-adjusted water levels.",
      icon: "waves",
      selected: false,
      legend_html: `<div class="colors"></div>
      <div style="overflow: hidden;">
        <p class="label third">5ft</p>
        <p class="label third">10ft</p>
        <p class="label third">15ft</p>
      </div>`,
      legend_displayed: false
    }
  ],
  sensor: undefined
};

const mutations = {
  toggleLayers(state, { index }) {
    state.layers.forEach((layer, i) => {
      layer.selected = i === index;
      layer.legend_displayed = i === index || i === 0; // always display the first legend
    });
    store.commit("app/selectLayer", { index }); //tell app a layer was changed
  },
  setSensor(state, { sensor }) {
    state.sensor = sensor;
    store.commit("app/selectSensor", { sensor }); //tell app the sensor was changed
  }
};

// const getters = {

// }

export default {
  namespaced: true,
  state,
  mutations
};
