<template>
  <UApp>
    <UContainer>
      <TaskDialog />
      <Sidebar />

      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<script lang="ts" setup>
import TaskDialog from "~/components/task-dialog.vue";
</script>

<style></style>
