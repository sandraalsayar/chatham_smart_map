import { shallowMount } from "@vue/test-utils";
import DatePicker from "@/components/timelapse/DatePicker";

describe("DatePicker", () => {
  const wrapper = shallowMount(DatePicker);

  it("has the expected elements", () => {
    expect(wrapper.find(".datepicker-trigger").exists()).toBe(true);
    expect(wrapper.find("i").text()).toEqual("calendar_today");
    expect(wrapper.contains("airbnbstyledatepicker-stub")).toBe(true);
  });
});
