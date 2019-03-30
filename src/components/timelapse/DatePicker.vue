<template>
  <div>
    <div class="datepicker-trigger">
      <div>
        <i class="material-icons">calendar_today</i>
        <input
          type="text"
          id="datepicker-trigger"
          placeholder="Select dates"
          :value="formatDates"
        />
      </div>
      <AirbnbStyleDatepicker
        :offset-y="-310"
        :trigger-element-id="'datepicker-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
        :endDate="endDate"
        @date-one-selected="
          val => {
            setDateOne({ val });
          }
        "
        @date-two-selected="
          val => {
            setDateTwo({ val });
          }
        "
        @opened="onOpen"
        @apply="onApply"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { parse, addMinutes, isToday, differenceInMinutes } from "date-fns";

export default {
  methods: {
    onApply() {
      let startDate = parse(this.dateOne);
      let endDate = parse(this.dateTwo); // not to be confused with this.endDate!
      if (isToday(endDate)) {
        // if the latter date is today, make the time match current time
        const minutesOffset = differenceInMinutes(new Date(), endDate);
        startDate = addMinutes(startDate, minutesOffset);
        endDate = addMinutes(endDate, minutesOffset);
      }

      this.$store.commit("timelapse/setIsPlaying", { isPlaying: false });
      this.$store.commit("timelapse/setSliderVal", { sliderVal: 0 });
      this.$store.commit("timelapse/setDates", { startDate, endDate });
    },
    onOpen() {
      this.$store.commit("timelapse/setIsPlaying", { isPlaying: false });
    },
    ...mapMutations("picker", ["setDateOne", "setDateTwo"])
  },
  computed: {
    ...mapGetters("picker", ["formatDates"]),
    ...mapState("picker", ["dateOne", "dateTwo", "endDate"])
  }
};
</script>

<style scoped>
i {
  position: absolute;
  bottom: 6px;
  left: 23px;
}

input {
  margin-right: 15px;
  margin-left: 15px;
  padding: 9px 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  text-indent: 25px;
  background: #fff;
  font-size: 12px;
  line-height: normal;
  font-family: system-ui;
}
</style>
