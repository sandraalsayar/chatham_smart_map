import { mount } from "@vue/test-utils";
import ConsoleLayersListItem from "@/components/console/ConsoleLayersListItem";

describe("ConsoleLayersListItem.vue", () => {
  const wrapper = mount(ConsoleLayersListItem, {
    propsData: {
      layer: {
        color: "red",
        selected: true
      }
    }
  });

  it("has the expected elements", () => {
    expect(wrapper.contains("li")).toBe(true);
    expect(wrapper.contains("i")).toBe(true);
    expect(wrapper.contains("h2")).toBe(true);
    expect(wrapper.contains("small")).toBe(true);
  });

  it("conditionally renders li color", () => {
    expect(wrapper.element.style.color).toBe("red");

    const layer = {
      color: "red",
      selected: false
    };
    wrapper.setProps({ layer });
    expect(wrapper.element.style.color).toBe("black");
  });
});
