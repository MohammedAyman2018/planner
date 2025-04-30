<template>
  <div class="min-h-screen flex items-center justify-center py-8">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Create Your Account</h1>
          <p class="text-gray-600 mt-1">Join Planner to organize your day</p>
        </div>
      </template>

      <UForm :state="formState" @submit="handleRegister">
        <div class="flex flex-col gap-4">
          <UFormField label="Full Name" name="name">
            <UInput
              class="w-full"
              v-model="formState.name"
              placeholder="John Doe"
              autocomplete="name"
            />
          </UFormField>

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
              placeholder="Create a strong password"
              autocomplete="new-password"
            />
          </UFormField>
          <UFormField label="Sleep Time" name="sleep_time">
            <UInput class="w-full" v-model="formState.sleep_time" type="time" />
          </UFormField>
          <UFormField label="Wake-up Time" name="wakeup_time">
            <UInput
              class="w-full"
              v-model="formState.wakeup_time"
              type="time"
            />
          </UFormField>

          <div class="mt-6">
            <UButton type="submit" color="primary" block :loading="loading">
              Create Account
            </UButton>
          </div>
        </div>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="text-primary-600 hover:underline"
              >Login</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { IUser } from "~/interfaces/users";

const router = useRouter();

// Form state
const formState: Ref<IUser> = ref({
  name: "",
  email: "",
  password: "",
  role: "user",
  sleep_time: "22:00",
  wakeup_time: "07:00",
});

// Loading state
const loading = ref(false);

const toast = useToast();

// Handle registration submission
const handleRegister = async () => {
  try {
    loading.value = true;

    // Validate form
    if (
      !formState.value.name ||
      !formState.value.email ||
      !formState.value.password ||
      !formState.value.sleep_time ||
      !formState.value.wakeup_time
    ) {
      toast.add({
        title: "Please fill in all fields",
        color: "error",
      });

      return;
    }

    // Call register API
    const response: any = await useFetch("/api/users", {
      method: "POST",
      body: {
        name: formState.value.name,
        email: formState.value.email,
        password: formState.value.password,
        sleep_time: formState.value.sleep_time,
        wakeup_time: formState.value.wakeup_time,
      },
    });

    // Handle successful registration
    if (response.status.value == "success") {
      toast.add({
        title: "Registration successful!",
        color: "success",
      });

      // Redirect to dashboard or home page
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  } catch (error: any) {
    // Handle registration error
    toast.add({
      title:
        error.data?.statusMessage || "Registration failed. Please try again.",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Page meta
useHead({
  title: "Register - Planner",
});
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
