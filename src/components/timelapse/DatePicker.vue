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
        :end-date="endDate"
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
        @closed="onClosed"
        @cancelled="onCancelled"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import {
  parse,
  addMinutes,
  isToday,
  differenceInMinutes,
  startOfDay
} from "date-fns";
let applied = false;

export default {
  methods: {
    onApply() {
      let startDate = parse(this.dateOne);
      let endDate = parse(this.dateTwo); // not to be confused with this.endDate!
      const minutesOffset = differenceInMinutes(new Date(), endDate);
      if (isToday(startDate)) {
        startDate = startOfDay(startDate);
        endDate = new Date();
      } else if (isToday(endDate)) {
        // if the latter date is today, make the time match current time
        endDate = addMinutes(endDate, minutesOffset);
        startDate = addMinutes(startDate, minutesOffset);
      } else if (!minutesOffset) {
        endDate = startDate;
      }
      this.$store.commit("timelapse/setIsPlaying", { isPlaying: false });
      this.$store.commit("timelapse/setSliderVal", { sliderVal: 0 });
      this.$store.commit("timelapse/setDates", { startDate, endDate });
      console.log("Applied");
      applied = true;
    },
    onClosed() {
      if (!applied) {
        console.log("Closed!");
        this.onApply();
      }
    },
    onCancelled() {
      //Makes sure that when hitting cancel, the dates DON'T get applied
      applied = true;
    },
    onOpen() {
      applied = false;
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
  margin-bottom: 15px;
}

input {
  margin-right: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
  padding: 11px 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  text-indent: 25px;
  background: #fff;
  font-size: 12px;
  line-height: normal;
  font-family: system-ui;
}
</style>
