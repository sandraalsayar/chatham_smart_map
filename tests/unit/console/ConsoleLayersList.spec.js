import Vuex from "vuex";
import cons from "@/store/modules/console";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ConsoleLayersList from "@/components/console/ConsoleLayersList";
import ConsoleLayersListItem from "@/components/console/ConsoleLayersListItem";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    cons
  }
});

describe("ConsoleLayersList", () => {
  const wrapper = shallowMount(ConsoleLayersList, { store, localVue });

  it("has a ul", () => {
    expect(wrapper.contains("ul")).toBe(true);
  });

  it("renders list items for each layer", () => {
    expect(wrapper.findAll(ConsoleLayersListItem)).toHaveLength(2);
  });
});
