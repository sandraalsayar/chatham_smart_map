<template>
  <div>
    <div class="datepicker-trigger">
      <div>
        <i class="material-icons">calendar_today</i>
        <input
          type="text"
          id="datepicker-trigger"
          placeholder="Select dates"
          :value="formatDates(dateOne, dateTwo)"
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
            dateOne = val;
          }
        "
        @date-two-selected="
          val => {
            dateTwo = val;
          }
        "
        @opened="onOpen"
        @apply="onApply"
      />
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import { format, addMinutes, isToday, differenceInMinutes } from "date-fns";
import { today, startDate } from "@/helpers/constants";

export default {
  data() {
    return {
      dateFormat: "D MMM",
      dateOne: "",
      dateTwo: "",
      endDate: ""
    };
  },
  methods: {
    formatDates(dateOne, dateTwo) {
      let formattedDates = "";
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += " - " + format(dateTwo, this.dateFormat);
      }
      return formattedDates;
    },
    onApply() {
      let earlyDate = new Date(this.dateOne);
      let lateDate = new Date(this.dateTwo);
      earlyDate = addMinutes(earlyDate, earlyDate.getTimezoneOffset()); // adjust date to user timezone
      lateDate = addMinutes(lateDate, lateDate.getTimezoneOffset());
      if (isToday(lateDate)) {
        // if the latter date is today, make the time match current time
        const minutesOffset = differenceInMinutes(new Date(), lateDate);
        earlyDate = addMinutes(earlyDate, minutesOffset);
        lateDate = addMinutes(lateDate, minutesOffset);
      }
      eventBus.$emit("dates-selected", earlyDate, lateDate);
    },
    onOpen() {
      eventBus.$emit("remote-pause");
    }
  },
  created() {
    this.dateTwo = format(today, "YYYY-MM-DD");
    this.dateOne = format(startDate, "YYYY-MM-DD");
    this.endDate = this.dateTwo;
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
