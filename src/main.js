import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import AirbnbStyleDatepicker from "vue-airbnb-style-datepicker";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(AirbnbStyleDatepicker, {
    colors: {
        selected: 'teal',
        inRange: '#02a9a7',
        selectedText: '#fff',
        text: 'teal',
        inRangeBorder: '#33dacd',
        disabled: '#fff',
  }
});
export const eventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");
