<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Timeline",
      icon: "i-lucide-clock",
      href: "/",
    },
    {
      label: "Activities",
      icon: "i-lucide-activity",
      href: "/activities",
    },
    {
      label: "Categories",
      icon: "i-lucide-tag",
      href: "/categories",
    },
  ],
]);
</script>

<template>
  <UNavigationMenu
    orientation="horizontal"
    :items="items"
    class="data-[orientation=vertical]:w-48"
  />
</template>
