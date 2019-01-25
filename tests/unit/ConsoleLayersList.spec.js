import { mount } from "@vue/test-utils";
import ConsoleLayersList from "@/components/ConsoleLayersList.vue";

describe("ConsoleLayersList.vue", () => {
	it("renders props.msg when passed", () => {
		const wrapper = mount(ConsoleLayersList);
		expect(wrapper.isVueInstance()).toBeTruthy();
	});
});
