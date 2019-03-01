<template>
  <console-card heading="MAP LEGEND">
    <div class="legend_row" v-for="legend in legends" :key="legend.id">
      <span
        :style="{ display: legend.displayed ? 'block' : 'none' }"
        v-html="legend.html"
      ></span>
    </div>
  </console-card>
</template>

<script>
import { eventBus } from "@/main";
import ConsoleCard from "./ConsoleCard";

export default {
  components: { ConsoleCard },
  data() {
    return {
      legends: [
        {
          id: 1,
          html: `<div class="label" id="sensor"></div>
      <div class="label">Sea-level sensors</div>`,
          displayed: true
        },
        {
          id: 2,
          html: `<div class="colors"></div>
      <div style="overflow: hidden;">
        <div class="label third">5ft</div>
        <div class="label third">10ft</div>
        <div class="label third">15ft</div>
      </div>`,
          displayed: false
        }
      ]
    };
  },
  created() {
    eventBus.$on("update-legend", emitterId => {
      this.legends.forEach(legend => {
        legend.displayed = legend.id === emitterId || legend.id === 1; // always display the first legend
      });
    });
  }
};
</script>

<style scoped>
.legend_row {
  margin: 5px;
}

.legend_row >>> .label {
  display: inline-block;
  text-align: center;
  font-size: 14px;
}

.legend_row >>> .third {
  width: 32%;
}

.legend_row >>> #sensor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #007cbf;
  opacity: 0.8;
  margin-right: 6px;
}

.legend_row >>> .colors {
  height: 12px;
  background: linear-gradient(
    to right,
    turquoise,
    deepskyblue,
    dodgerblue,
    navy
  );
}
</style>
