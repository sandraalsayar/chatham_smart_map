<template>
  <console-card heading="MAP LAYERS">
    <ul>
      <ConsoleLayersListItem
        v-for="(layer, index) in layers"
        :key="index"
        :layer="layer"
        @toggleLayers="toggleLayers({ index })"
      />
    </ul>
  </console-card>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ConsoleCard from "./ConsoleCard";
import ConsoleLayersListItem from "./ConsoleLayersListItem";

export default {
  components: { ConsoleCard, ConsoleLayersListItem },
  computed: {
    ...mapState("cons", ["layers"])
  },
  methods: {
    ...mapMutations("cons", ["toggleLayers"])
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0px;
}
</style>
