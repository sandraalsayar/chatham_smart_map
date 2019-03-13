<template>
  <div>
    <div class="datepicker-trigger">
      <v-icon id="event-icon" large color="teal">event</v-icon>
      <input
        type="text"
        id="datepicker-trigger"
        prepend-inner-icon="event"
        placeholder="Select dates"
        :value="formatDates(dateOne, dateTwo)"
      />

      <AirbnbStyleDatepicker
        :offset-y="-270"
        :trigger-element-id="'datepicker-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
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
      dateTwo: ""
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
  }
};
</script>

<style>
#event-icon {
  display: inline-block;

}
input {
    margin-right: 15px;
    margin-left: 15px;
    padding: 9px 8px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    text-rendering: auto;
    color: initial;
    text-indent: 0px;
    display: inline-block;
    background: #fff;
    font-weight: 400;
    font-size: 12px;
    line-height: normal;
    font-family: system-ui;
}

</style>
