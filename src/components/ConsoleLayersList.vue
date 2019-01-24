<template>
  <console-card heading="MAP LAYERS">
    <ul>
      <ConsoleLayersListItem
        v-for="layer in layers"
        :key="layer.id"
        :layer="layer"
        @update-console="updateConsole"
      />
    </ul>
  </console-card>
</template>

<script>
import { eventBus } from "../main";
import ConsoleCard from "./ConsoleCard.vue";
import ConsoleLayersListItem from "./ConsoleLayersListItem.vue";

export default {
  components: { ConsoleCard, ConsoleLayersListItem },
  data() {
    return {
      layers: [
        {
          id: 1,
          name: "Sensors",
          color: "steelblue",
          description: "A description of this layer goes here",
          icon: "bubble_chart",
          selected: true
        },
        {
          id: 2,
          name: "Inundation",
          color: "dodgerblue",
          description: "A description of this layer goes here",
          icon: "waves",
          selected: false
        }
      ]
    };
  },
  methods: {
    updateConsole(emitterId) {
      this.layers.forEach(layer => {
        layer.selected = layer.id === emitterId;
      });
      eventBus.$emit("update-legend", emitterId);
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 5px;
  margin-top: 14px;
  margin-bottom: 14px;
}
</style>
