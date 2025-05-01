<template>
  <UDrawer v-model="isOpen" title="Add Task">
    <UButton
      class="fixed bottom-10 right-10 rounded-full"
      color="primary"
      size="xl"
      variant="solid"
      trailing-icon="i-lucide-plus"
      @click="openDrawer"
    />

    <template #body>
      <div class="container mx-auto">
        <UForm :state="formState" @submit="handleSubmit" class="space-y-6">
          <!-- Title -->
          <UFormField label="Title" name="title" required>
            <UInput
              class="w-full"
              v-model="formState.title"
              placeholder="Task title"
            />
          </UFormField>

          <!-- Activity Selection -->
          <UFormField label="Activity" name="activity_id" required>
            <USelect
              class="w-full"
              v-model="formState.activity_id"
              :items="activities!"
              placeholder="Select an activity"
              label-key="label"
              value-key="_id"
            />
          </UFormField>

          <!-- Time Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Start Time" name="start_time" required>
              <UInput
                class="w-full"
                v-model="formState.start_time"
                type="datetime-local"
              />
            </UFormField>

            <UFormField label="End Time" name="end_time" required>
              <UInput
                class="w-full"
                v-model="formState.end_time"
                type="datetime-local"
              />
            </UFormField>
          </div>

          <!-- Recurrence -->
          <UFormField label="Recurrence" name="recurrence">
            <USelect
              class="w-full"
              v-model="formState.recurrence"
              :items="recurrenceOptions"
              placeholder="Select recurrence pattern"
            />
          </UFormField>

          <!-- Recurrence End Date (shown only if recurrence is not 'none') -->
          <UFormField
            v-if="formState.recurrence !== 'none'"
            label="Recurrence End Date"
            name="recurrence_end"
          >
            <UInput
              class="w-full"
              v-model="formState.recurrence_end"
              type="date"
            />
          </UFormField>

          <!-- Recurrence Days (shown only if recurrence is 'weekly') -->
          <UFormField
            v-if="formState.recurrence === 'weekly'"
            label="Recurrence Days"
            name="recurrence_days"
          >
            <div class="flex flex-wrap gap-2">
              <UCheckbox
                v-for="(day, index) in weekDays"
                :key="index"
                :value="index"
                :checked="selectedDays.includes(index)"
                :label="day"
                :name="day + index"
                @change="updateRecurrenceDays"
              />
            </div>
          </UFormField>

          <!-- Description -->
          <UFormField label="Description" name="description">
            <UTextarea
              class="w-full"
              v-model="formState.description"
              placeholder="Task description"
              :rows="3"
            />
          </UFormField>

          <!-- Status -->
          <UFormField label="Status" name="status">
            <USelect
              class="w-full"
              v-model="formState.status"
              :options="statusOptions"
              placeholder="Select status"
            />
          </UFormField>

          <!-- Submit Button -->
          <div class="mt-6 flex justify-end">
            <UButton type="submit" color="primary" :loading="loading">
              Save Task
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { IActivity } from "~/interfaces/activities";

// Drawer state
const isOpen = ref(false);
const loading = ref(false);
const toast = useToast();

// Form state
const formState = ref({
  activity_id: "",
  title: "",
  start_time: "",
  end_time: "",
  recurrence: "none",
  recurrence_end: "",
  recurrence_days: [] as number[],
  description: "",
  status: "planned",
});

// Days of the week for recurrence selection
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const selectedDays = ref<number[]>([]);

// Update recurrence days when checkboxes change
const updateRecurrenceDays = () => {
  formState.value.recurrence_days = [...selectedDays.value];
};

// Mock activities data - replace with actual data fetch
const { data: activities, refresh } = await useFetch<IActivity[]>(
  "/api/activities"
);

// Options for dropdowns
const recurrenceOptions = [
  { label: "None", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const statusOptions = [
  { label: "Planned", value: "planned" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

// Open drawer function
const openDrawer = () => {
  isOpen.value = true;
};

// Form submission handler
const handleSubmit = async () => {
  try {
    loading.value = true;

    // Validate form
    if (
      !formState.value.title ||
      !formState.value.activity_id ||
      !formState.value.start_time ||
      !formState.value.end_time
    ) {
      toast.add({
        title: "Error",
        description: "Please fill in all required fields",
        color: "error",
      });
      return;
    }

    // Validate end time is after start time
    const startTime = new Date(formState.value.start_time);
    const endTime = new Date(formState.value.end_time);

    if (endTime <= startTime) {
      toast.add({
        title: "Error",
        description: "End time must be after start time",
        color: "error",
      });
      return;
    }

    // Prepare task data
    const taskData = {
      ...formState.value,
      user_id: "current-user-id", // Replace with actual user ID from auth
      start_time: new Date(formState.value.start_time).toISOString(),
      end_time: new Date(formState.value.end_time).toISOString(),
      recurrence_end: formState.value.recurrence_end
        ? new Date(formState.value.recurrence_end).toISOString()
        : undefined,
    };

    // Call API to save task
    // const response = await $fetch('/api/tasks', {
    //   method: 'POST',
    //   body: taskData
    // });

    // For now, just log the data
    console.log("Task data to save:", taskData);

    // Show success message
    toast.add({
      title: "Success",
      description: "Task created successfully",
      color: "primary",
    });

    // Reset form and close drawer
    resetForm();
    isOpen.value = false;
  } catch (error) {
    console.error("Error saving task:", error);
    toast.add({
      title: "Error",
      description: "Failed to save task",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Reset form to initial state
const resetForm = () => {
  formState.value = {
    activity_id: "",
    title: "",
    start_time: "",
    end_time: "",
    recurrence: "none",
    recurrence_end: "",
    recurrence_days: [],
    description: "",
    status: "planned",
  };
  selectedDays.value = [];
};
</script>

<style>
/* Additional custom styles can be added here if needed */
</style>
