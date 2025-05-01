<template>
  <div class="min-h-screen py-8">
    <div class="max-w-3xl mx-auto">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Your Profile</h1>
            <UButton
              v-if="isEditing"
              color="neutral"
              variant="ghost"
              @click="cancelEdit"
            >
              Cancel
            </UButton>
          </div>
        </template>

        <UForm :state="formState" @submit="saveProfile">
          <div class="space-y-6">
            <!-- Profile Information Section -->
            <div>
              <h2 class="text-lg font-medium mb-4">Personal Information</h2>

              <UFormField label="Full Name" name="name" class="mb-3">
                <UInput
                  class="w-full"
                  v-model="formState.name"
                  placeholder="Your full name"
                  :disabled="!isEditing"
                />
              </UFormField>

              <UFormField label="Email Address" name="email">
                <UInput
                  class="w-full"
                  v-model="formState.email"
                  type="email"
                  placeholder="your@email.com"
                  :disabled="!isEditing"
                />
              </UFormField>
            </div>

            <!-- Sleep Schedule Section -->
            <div>
              <h2 class="text-lg font-medium mb-4">Sleep Schedule</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Sleep Time" name="sleep_time ">
                  <UInput
                    class="w-full"
                    v-model="formState.sleep_time"
                    type="time"
                    :disabled="!isEditing"
                  />
                </UFormField>

                <UFormField label="Wake-up Time" name="wakeup_time">
                  <UInput
                    class="w-full"
                    v-model="formState.wakeup_time"
                    type="time"
                    :disabled="!isEditing"
                  />
                </UFormField>
              </div>
            </div>

            <!-- Password Section -->
            <div v-if="isEditing">
              <h2 class="text-lg font-medium mb-4">Change Password</h2>

              <UFormField label="Current Password" name="currentPassword">
                <UInput
                  class="w-full"
                  v-model="formState.currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                />
              </UFormField>

              <UFormField label="New Password" name="newPassword">
                <UInput
                  class="w-full"
                  v-model="formState.newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </UFormField>

              <UFormField label="Confirm New Password" name="confirmPassword">
                <UInput
                  class="w-full"
                  v-model="formState.confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </UFormField>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <UButton v-if="!isEditing" color="primary" @click="startEdit">
              Edit Profile
            </UButton>

            <UButton v-else type="submit" color="primary" :loading="loading">
              Save Changes
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IUser } from "~/interfaces/users";

// User state
const user = ref<Partial<IUser>>({});
const isEditing = ref(false);
const loading = ref(false);

// Form state
const formState = ref({
  name: "",
  email: "",
  sleep_time: "",
  wakeup_time: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Use toast instead of notification
const toast = useToast();

// Fetch user data on page load
onMounted(async () => {
  const userCookie = useCookie<IUser>("user_data");

  try {
    loading.value = true;
    if (!userCookie.value) {
      showToast("Failed to load profile data", "error");
      return;
    }

    const userData: IUser | null = await $fetch(
      `/api/users/${userCookie.value._id}`
    );

    if (!userData) {
      showToast("Failed to load profile data", "error");
      return;
    }
    user.value = userData;

    // Initialize form with user data
    formState.value.name = userData.name || "";
    formState.value.email = userData.email || "";
    formState.value.sleep_time = userData.sleep_time || "";
    formState.value.wakeup_time = userData.wakeup_time || "";
  } catch (error) {
    showToast("Failed to load profile data", "error");
  } finally {
    loading.value = false;
  }
});

// Start editing mode
function startEdit() {
  isEditing.value = true;
}

// Cancel editing
function cancelEdit() {
  // Reset form to original values
  formState.value.name = user.value.name || "";
  formState.value.email = user.value.email || "";
  formState.value.sleep_time = user.value.sleep_time || "";
  formState.value.wakeup_time = user.value.wakeup_time || "";
  formState.value.currentPassword = "";
  formState.value.newPassword = "";
  formState.value.confirmPassword = "";

  isEditing.value = false;
}

// Save profile changes
async function saveProfile() {
  try {
    loading.value = true;

    // Validate form
    if (
      !formState.value.name ||
      !formState.value.email ||
      !formState.value.sleep_time ||
      !formState.value.wakeup_time
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Validate password if changing
    if (formState.value.newPassword) {
      if (!formState.value.currentPassword) {
        showToast(
          "Current password is required to set a new password",
          "error"
        );
        return;
      }

      if (formState.value.newPassword !== formState.value.confirmPassword) {
        showToast("New passwords do not match", "error");
        return;
      }

      if (formState.value.newPassword.length < 8) {
        showToast("Password must be at least 8 characters long", "error");
        return;
      }
    }

    // Prepare update data
    const updateData: Partial<IUser> = {
      name: formState.value.name,
      email: formState.value.email,
      sleep_time: formState.value.sleep_time,
      wakeup_time: formState.value.wakeup_time,
    };

    // Add password if changing
    if (formState.value.newPassword) {
      updateData.password = formState.value.newPassword;
    }

    // Call update API
    await updateUserProfile(updateData, formState.value.currentPassword);

    // Update local user data
    user.value = {
      ...user.value,
      ...updateData,
    };

    showToast("Profile updated successfully", "success");
    isEditing.value = false;

    // Clear password fields
    formState.value.currentPassword = "";
    formState.value.newPassword = "";
    formState.value.confirmPassword = "";
  } catch (error: any) {
    showToast(error.message || "Failed to update profile", "error");
  } finally {
    loading.value = false;
  }
}

// Mock function to update user profile
// Replace with actual API call in production
async function updateUserProfile(
  userData: Partial<IUser>,
  currentPassword?: string
) {
  const userCookie: Ref<IUser> = useCookie("user_data");

  try {
    const response: any = await $fetch(`/api/users/${userCookie.value._id}`, {
      method: "PATCH",
      body: {
        ...userData,
        currentPassword,
      },
    });

    if (!response._id) {
      throw new Error(response.message || "Failed to update profile");
    }
  } catch (error: any) {
    showToast(error.message || "Failed to update profile", "error");
  }
}

// Helper to show toast notifications
function showToast(text: string, type: "info" | "success" | "error" = "info") {
  toast.add({
    title:
      type === "error"
        ? "Error"
        : type === "success"
        ? "Success"
        : "Information",
    description: text,
    color: type === "error" ? "error" : type === "success" ? "primary" : "info",
  });
}

// Page meta
useHead({
  title: "Your Profile - Planner",
});

definePageMeta({
  title: "Your Profile - Planner",
  middleware: "auth",
});
</script>
