<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [],
  [
    {
      label: "Login",
      icon: "i-lucide-user",
      href: "/login",
    },
  ],
]);

const router = useRouter();
const loggedIn = useCookie("auth_token");

const renderLinks = (value: boolean) => {
  if (value) {
    items.value[0] = [
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
    ];

    items.value[1] = [
      {
        label: "Profile",
        icon: "i-lucide-user",
        href: "/profile",
      },
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        onSelect: () => {
          loggedIn.value = null;
          router.push("/login");
        },
      },
    ];
  } else {
    items.value[0] = [];
    items.value[1] = [
      {
        label: "Login",
        icon: "i-lucide-user",
        href: "/login",
      },
    ];
  }
};
onMounted(() => {
  renderLinks(!!loggedIn.value);
});
watch(loggedIn, (newValue) => {
  renderLinks(!!newValue);
});
</script>

<template>
  <UNavigationMenu
    orientation="horizontal"
    :items="items"
    class="data-[orientation=vertical]:w-48"
  />
</template>
