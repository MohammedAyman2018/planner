<template>
  <div class="container mx-auto p-4 rtl">
    <h1 class="text-2xl font-bold text-center mb-6">Activites summary</h1>

    <div class="overflow-x-auto">
      <UTable :data="activities" class="flex-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const weekDaysShort = ref(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]);

// Define your activity schedules
const activitySchedules = [
  {
    name: "استيقاظ",
    schedule: [true, true, true, true, true, true, false],
  },
  {
    name: "فطور + مذاكرة",
    schedule: [true, true, true, true, true, false, false],
  },
  {
    name: "شغل",
    schedule: [true, true, true, true, false, false, false],
  },
  {
    name: "جيم",
    schedule: [true, false, false, false, false, true, false],
  },
  {
    name: "درس",
    schedule: [false, true, true, true, false, false, false],
  },
  {
    name: "فالورانت",
    schedule: [true, false, true, false, true, true, false],
  },
];

// Transform the data into the desired format
const activities = activitySchedules.map((activity) => {
  // Start with the name property
  const formattedActivity: any = { name: activity.name };

  // Add each day as a property
  activity.schedule.forEach((isActive, index) => {
    formattedActivity[weekDaysShort.value[index]] = isActive ? "✅" : "❌";
  });

  return formattedActivity;
});
</script>

<style scoped lang="scss"></style>
