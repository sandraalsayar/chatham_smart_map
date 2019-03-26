import { shallowMount } from "@vue/test-utils";
import PlayButton from "@/components/timelapse/PlayButton";

describe("PlayButton", () => {
  const wrapper = shallowMount(PlayButton);

  it("has the default elements", () => {
    expect(wrapper.contains("v-btn-stub")).toBe(true);
    expect(wrapper.find("v-icon-stub").text()).toEqual("play_arrow");
  });

  it("has the default elements", () => {
    const isPlaying = true;
    wrapper.setData({ isPlaying });

    expect(wrapper.find("v-icon-stub").text()).toEqual("pause");
  });
});
