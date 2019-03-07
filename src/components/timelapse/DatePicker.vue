<template>
  <div>
    <div class="datepicker-trigger">
      <input
        type="text"
        id="datepicker-trigger"
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
        @apply="onApply"
      />
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import {
  format,
  addMinutes,
  isToday,
  differenceInMinutes
  } from "date-fns";

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
      let earlyDate = new Date(this.dateOne)
      let lateDate = new Date(this.dateTwo)
      earlyDate = addMinutes(earlyDate, earlyDate.getTimezoneOffset()) // adjust date to user timezone
      lateDate = addMinutes(lateDate, lateDate.getTimezoneOffset())
      if (isToday(lateDate)) { // if the latter date is today, make the time match current time
        const minutesOffset = differenceInMinutes(new Date(), lateDate)
        earlyDate = addMinutes(earlyDate, minutesOffset)
        lateDate = addMinutes(lateDate,minutesOffset)
      }
      eventBus.$emit("dates-selected", earlyDate.toISOString(), lateDate.toISOString())
    }
  }
};
</script>

<style>
#event-icon {
  display: inline-block;
}
input {
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
/*    -webkit-writing-mode: horizontal-tb !important;*/
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    background: #fff;
    font-style: normal;
    font-variant-ligatures: normal;
    font-variant-caps: normal;
    font-variant-numeric: normal;
    font-variant-east-asian: normal;
    font-weight: 400;
    font-stretch: normal;
    font-size: 12px;
    line-height: normal;
    font-family: system-ui;
}

</style>
