import { mount } from "@vue/test-utils";
import ConsoleLayersList from "@/components/console/ConsoleLayersList.vue";
import ConsoleLayersListItem from "@/components/console/ConsoleLayersListItem.vue";

describe("ConsoleLayersList.vue", () => {
  const wrapper = mount(ConsoleLayersList);

  it("has a ul", () => {
    expect(wrapper.contains("ul")).toBe(true);
  });

  it("renders list items for each layer", () => {
    const layers = [{}];
    wrapper.setData({ layers });

    expect(wrapper.findAll(ConsoleLayersListItem)).toHaveLength(layers.length);
  });

  it("updates the selected layer on click events", () => {
    const layers = [
      {
        id: 1,
        color: "red",
        selected: false
      },
      {
        id: 2,
        color: "blue",
        selected: true
      }
    ];
    wrapper.setData({ layers });

    const [one, two] = wrapper.findAll(ConsoleLayersListItem).wrappers;
    const get_color = el => el.element.style.color;

    expect(get_color(one)).toBe("black"); // black when selected = false
    expect(get_color(two)).toBe("blue");

    two.trigger("click");
    expect(get_color(one)).toBe("black");
    expect(get_color(two)).toBe("blue");

    one.trigger("click");
    expect(get_color(one)).toBe("red");
    expect(get_color(two)).toBe("black");
    expect(layers[0].selected).toBe(true);
    expect(layers[1].selected).toBe(false);
  });
});
