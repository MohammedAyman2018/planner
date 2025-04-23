<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-center mb-6">WEEKLY TIMELINE</h1>

    <!-- Timeline Grid -->
    <div class="grid grid-cols-[100px_repeat(7,1fr)] gap-1 p-9">
      <!-- Empty top-left cell -->
      <div class="h-12"></div>

      <!-- Days of the week headers -->
      <div
        v-for="day in weekDaysShort"
        :key="day"
        class="h-12 flex items-center justify-center font-bold"
      >
        {{ day }}
      </div>

      <!-- Time slots and grid -->
      <template v-for="(time, index) in timeSlots" :key="time.label">
        <!-- Time labels -->
        <div class="flex items-center justify-end pr-2 relative h-16">
          {{ time.label }}
        </div>

        <!-- Grid cells for each day -->
        <div
          v-for="day in 7"
          :key="`${time.label}-${day}`"
          class="border h-16 hover:bg-gray-100 transition-colors cursor-pointer"
        ></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const weekDaysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const startingHour = 7;
const timeSlots: any = ref([]);

onMounted(() => {
  generateTimeSlots();
});

const generateTimeSlots = () => {
  for (let hour = startingHour; hour <= 13; hour++) {
    // Add hour slot
    timeSlots.value.push({
      label: `${hour.toString().padStart(2, "0")}:00`,
      meridiem: hour === 7 || hour === 12 ? (hour >= 12 ? "PM" : "AM") : "",
    });

    // Add half-hour slot
    if (hour !== 13) {
      timeSlots.value.push({
        label: `${hour.toString().padStart(2, "0")}:30`,
        meridiem: "",
      });
    }
  }
};
</script>

<style>
.grid {
  border: 1px solid #e2e8f0;
}
</style>
