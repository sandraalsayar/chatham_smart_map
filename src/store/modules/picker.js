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

export default {
  namespaced: true,
  state,
  mutations
};
