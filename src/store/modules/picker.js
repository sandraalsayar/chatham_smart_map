import { yesterday, today } from "@/helpers/constants";
import { format } from "date-fns";

const state = {
  dateOne: format(yesterday, "YYYY-MM-DD"),
  dateTwo: format(today, "YYYY-MM-DD"),
  endDate: format(today, "YYYY-MM-DD")
};

const mutations = {
  setDateOne(state, { val }) {
    state.dateOne = val;
  },
  setDateTwo(state, { val }) {
    state.dateTwo = val;
  }
};

const getters = {
  // Formatting for dates that appear in the input text box
  formatDates(state) {
    let formattedDates = "";
    if (state.dateOne) {
      formattedDates = format(state.dateOne, "D MMM");
    }
    if (state.dateTwo) {
      formattedDates += " - " + format(state.dateTwo, "D MMM");
    }
    return formattedDates;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
