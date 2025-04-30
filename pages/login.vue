<template>
  <div class="min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Login to Planner</h1>
        </div>
      </template>

      <UForm :state="formState" @submit="handleLogin">
        <div class="flex flex-col gap-4">
          <UFormField label="Email" name="email">
            <UInput
              class="w-full"
              v-model="formState.email"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
            />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput
              class="w-full"
              v-model="formState.password"
              type="password"
              placeholder="Your password"
              autocomplete="current-password"
              :ui="{ base: 'w-full' }"
            />
          </UFormField>
        </div>

        <div class="mt-4">
          <UButton type="submit" color="primary" block :loading="loading">
            Login
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600">
          <p>
            Don't have an account?
            <NuxtLink to="/register" class="text-primary-600 hover:underline"
              >Register</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

// Form state
const formState = ref({
  email: "",
  password: "",
});

// Loading state
const loading = ref(false);

const toast = useToast();

// Handle login submission
const handleLogin = async () => {
  try {
    loading.value = true;

    // Validate form
    if (!formState.value.email || !formState.value.password) {
      toast.add({
        title: "Please fill in all fields",
        color: "error",
      });
      return;
    }

    // Call login API
    const response: any = await useFetch("/api/users/login", {
      method: "POST",
      body: {
        email: formState.value.email,
        password: formState.value.password,
      },
    });

    // Handle successful login
    if (response.status.value === "success") {
      console.log(response.data.value.user);

      useCookie("auth_token").value = response.data.value.user.token;
      toast.add({
        title: "Login successful!",
        color: "success",
      });

      router.push("/");
    }
  } catch (error: any) {
    // Handle login error
    toast.add({
      title:
        error.data?.statusMessage ||
        "Login failed. Please check your credentials.",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Page meta
useHead({
  title: "Login - Planner",
});
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
