<template>
  <div class="container mx-auto">
    <TimeLine />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Time Line",
  middleware: "auth",
});

import TimeLine from "@/components/timeline.vue";
</script>

<style></style>
