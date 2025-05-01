<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-center mb-6">WEEKLY TIMELINE</h1>
    <vue-cal
      :events="events"
      :time-from="
        (() => {
          const [hours, minutes] = (user?.wakeup_time || '07:00').split(':');
          return parseInt(hours) * 60 + parseInt(minutes);
        })()
      "
      :time-to="
        (() => {
          const [hours, minutes] = (user?.sleep_time || '22:00').split(':');
          return parseInt(hours) * 60 + parseInt(minutes);
        })()
      "
    />

    <!-- Timeline Grid -->
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import { VueCal } from "vue-cal";
import "vue-cal/style";
import type { IUser } from "~/interfaces/users";

const user = useCookie<IUser>("user_data");

const events = ref([
  {
    start: new Date(new Date().setHours(10, 30, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    title: "Doctor Appt.",
    content: '<i class="icon mdi mdi-stethoscope"></i>',
    class: "health", // Custom CSS class.
  },
  {
    start: new Date(new Date().setHours(9, 0)), // Using Vue Cal's Date prototypes.
    end: new Date(new Date().setHours(10, 0)), // Using Vue Cal's Date prototypes.
    title: "Doctor Appt.",
    content: '<i class="w-icon mdi mdi-stethoscope"></i>',
    class: "health",
    backgroundColor: "rgb(158 199 237)", // Dynamic colors.
    color: "#0e5597", // Dynamic colors.
  },
]);
</script>

<style></style>
