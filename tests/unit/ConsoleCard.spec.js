import { mount } from "@vue/test-utils";
import ConsoleCard from "@/components/console/ConsoleCard.vue";

describe("ConsoleCard.vue", () => {
  const wrapper = mount(ConsoleCard, {
    propsData: {
      heading: "Test"
    }
  });

  it("has a h2", () => {
    expect(wrapper.contains("h2")).toBe(true);
  });

  it("renders the correct markup", () => {
    expect(wrapper.html()).toContain("<h2>Test</h2>");
  });
});
