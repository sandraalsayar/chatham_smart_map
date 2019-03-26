import { shallowMount } from "@vue/test-utils";
import TheTimelapse from "@/components/timelapse/TheTimelapse";
import PlayButton from "@/components/timelapse/PlayButton";
import DatePicker from "@/components/timelapse/DatePicker";
import TimelapseBar from "@/components/timelapse/TimelapseBar";

describe("TheTimelapse", () => {
  const wrapper = shallowMount(TheTimelapse, {
    propsData: {
      text: "Test"
    }
  });

  it("has a v-alert", () => {
    expect(wrapper.contains("v-alert")).toBe(true);
  });

  it("renders the correct text", () => {
    expect(wrapper.text()).toMatch("Test");
  });
});
