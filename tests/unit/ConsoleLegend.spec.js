import { mount } from "@vue/test-utils";
import { eventBus } from "@/main";
import ConsoleLegend from "@/components/ConsoleLegend.vue";

describe("ConsoleLegend.vue", () => {
  const wrapper = mount(ConsoleLegend);

  it("renders div elements for each legend", () => {
    const legends = [{}];
    wrapper.setData({ legends });

    expect(wrapper.findAll("div.legend_row")).toHaveLength(legends.length);
  });

  it("updates the displayed legends on click events", () => {
    const legends = [
      {
        id: 1,
        displayed: true
      },
      {
        id: 2,
        displayed: false
      },
      {
        id: 3,
        displayed: true
      }
    ];

    wrapper.setData({ legends });
    const [one, two, three] = wrapper.findAll("div.legend_row").wrappers;
    const get_display = el => el.find("span").element.style.display;

    expect(get_display(one)).toBe("block");
    expect(get_display(two)).toBe("none");
    expect(get_display(three)).toBe("block");

    eventBus.$emit("update-legend", 1);
    expect(get_display(one)).toBe("block");
    expect(get_display(two)).toBe("none");
    expect(get_display(three)).toBe("none");

    eventBus.$emit("update-legend", 2);
    expect(get_display(one)).toBe("block"); // always display the first legend
    expect(get_display(two)).toBe("block");
    expect(get_display(three)).toBe("none");
  });
});
