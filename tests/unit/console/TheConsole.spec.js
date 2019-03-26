import { shallowMount } from "@vue/test-utils";
import TheConsole from "@/components/console/TheConsole";
import ConsoleLayersList from "@/components/console/ConsoleLayersList";
import ConsoleLegend from "@/components/console/ConsoleLegend";
import InformationCard from "@/components/console/InformationCard";

describe("TheConsole", () => {
  const wrapper = shallowMount(TheConsole);

  it("has ConsoleLayersList and ConsoleLegend", () => {
    expect(wrapper.contains(ConsoleLayersList)).toBe(true);
    expect(wrapper.contains(ConsoleLegend)).toBe(true);
  });

  it("does not initially have InformationCard", () => {
    expect(wrapper.contains(InformationCard)).toBe(false);
  });

  it("has a InformationCard when infoCardVisible = true", () => {
    const infoCardSensor = {};
    const infoCardVisible = true;
    wrapper.setData({ infoCardSensor, infoCardVisible });
    expect(wrapper.contains(InformationCard)).toBe(true);
  });
});
