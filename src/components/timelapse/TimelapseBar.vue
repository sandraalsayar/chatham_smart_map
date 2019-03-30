<template>
  <div id="bar">
    <v-slider
      v-model="sliderVal"
      :tick-labels="ticksLabels"
      :max="maxVal"
      step="1"
      ticks="always"
      tick-size="3"
      color="teal"
      always-dirty
      :thumb-label="thumbLabel"
    >
      <template v-slot:thumb-label="props">
        <span>
          {{ getThumbLabel(sliderVal) }}
        </span>
      </template>
    </v-slider>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      interval: null
    };
  },
  methods: {
    getThumbLabel(sliderVal) {
      return this.$store.getters["timelapse/getThumbLabel"](sliderVal);
    },
    advanceTimelapse() {
      if (this.sliderVal === this.maxVal) {
        this.$store.commit("timelapse/setSliderVal", { sliderVal: 0 });
      } else {
        this.$store.commit("timelapse/setSliderVal", {
          sliderVal: this.sliderVal + 1
        });
      }
    }
  },
  computed: {
    sliderVal: {
      get() {
        return this.$store.state.timelapse.sliderVal;
      },
      set(sliderVal) {
        this.$store.commit("timelapse/setSliderVal", { sliderVal });
      }
    },
    ...mapState("timelapse", ["thumbLabel"]),
    ...mapGetters("timelapse", ["ticksLabels", "maxVal"])
  },
  created() {
    this.$store.watch(
      ({ timelapse }) => timelapse.isPlaying,
      isPlaying => {
        if (isPlaying) {
          this.interval = setInterval(this.advanceTimelapse, 1000);
          this.$store.commit("timelapse/setThumbLabel", {
            thumbLabel: "always"
          });
        } else {
          clearInterval(this.interval);
          this.$store.commit("timelapse/setThumbLabel", { thumbLabel: true });
        }
      }
    );
  },
  mounted: function() {
    // Create an arrow below the v-slider thumb-label
    const node = document.createElement("div");
    node.className = "arrow-down";
    document
      .getElementsByClassName("v-slider__thumb-label__container")[0]
      .appendChild(node);
  }
};
</script>

<style scoped>
#bar {
  margin-left: 30px;
  flex-grow: 1;
}
</style>
