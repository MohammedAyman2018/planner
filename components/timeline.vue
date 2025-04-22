<template>
  <div class="border border-indigo-600 text-white">TimeLine</div>

  <header>
    <div class="flex justify-between items-center">
      <div class="flex">
        <div class="flex flex-col">
          <div class="font-bold text-lg">
            {{ weekDays[0] }}
          </div>
          <div class="font-bold text-lg">
            {{ weekDays[1] }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
</script>

<style></style>
