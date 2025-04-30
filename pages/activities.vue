<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Activities</h1>
      <UButton color="primary" @click="openAddModal">Add Activity</UButton>
    </div>

    <!-- Activities Table -->

    <UTable :columns="columns" :data="activities!" :loading="loading">
      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          <UIcon :name="row.original.category_id.icon" class="text-lg" />

          {{ row.original.category_id.name }}
        </div>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            color="warning"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            @click="editActivity(row)"
          />
          <UButton
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="confirmDelete(row)"
          />
        </div>
      </template>
    </UTable>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="isModalOpen">
      <template #header>
        <div class="text-xl font-bold">
          {{ isEditing ? "Edit Activity" : "Add Activity" }}
        </div>
      </template>

      <template #body>
        <ActivitiesForm
          :initial-data="currentActivity"
          @submit="handleFormSubmit"
          @cancel="isModalOpen = false"
        />
      </template>
    </UModal>

    <!-- Delete Confirmation Dialog -->
    <UModal v-model:open="isDeleteDialogOpen">
      <template #header>
        <div class="text-xl font-bold">Confirm Deletion</div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4">
            Are you sure you want to delete the activity "{{
              currentActivity?.label
            }}"?
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            color="neutral"
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </UButton>
          <UButton color="error" @click="deleteActivity(currentActivity!._id!)"
            >Delete</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { IActivity } from "~/interfaces/activities";

definePageMeta({
  title: "Activities",
  middleware: "auth",
});

// Table columns definition
const columns = ref([
  {
    accessorKey: "label",
    header: "Label",
    label: "Activity Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    label: "Category",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    label: "Actions",
  },
]);

// Sample activities data
const { data: activities, refresh } = await useFetch<IActivity[]>(
  "/api/activities"
);

const loading = ref(false);
const isModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditing = ref(false);
const currentActivity: Ref<IActivity | null> = ref(null);

// Open modal for adding a new activity
const openAddModal = () => {
  currentActivity.value = null;
  isEditing.value = false;
  isModalOpen.value = true;
};

// Open modal for editing an activity
const editActivity = (activity: any) => {
  currentActivity.value = {
    ...activity.original,
    category: activity.original.category_id._id,
  };
  isEditing.value = true;
  isModalOpen.value = true;
};

// Open confirmation dialog for deleting an activity
const confirmDelete = (activity: any) => {
  currentActivity.value = activity.original;
  isDeleteDialogOpen.value = true;
};

// Handle form submission (add or edit)
const handleFormSubmit = async (formData: any) => {
  console.log(formData);

  if (isEditing.value) {
    try {
      const { data, error } = await useFetch(
        `/api/activities/${currentActivity.value?._id}`,
        {
          method: "patch",
          body: {
            label: formData.label,
            category_id: formData.category,
          },
        }
      );

      if (error.value) {
        console.error("Failed to update user:", error.value);
        return null;
      }

      console.log("Category updated successfully:", data.value);
      await refresh();
      isModalOpen.value = false;
    } catch (error) {
      console.error("Error calling update endpoint:", error);
      throw error;
    }
  } else {
    loading.value = true;
    try {
      await $fetch("/api/activities", {
        method: "POST",
        body: {
          label: formData.label,
          category_id: formData.category,
        },
      });
      // Refresh the activities list
      await refresh();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      loading.value = false;
    }
  }

  isModalOpen.value = false;
};

// Delete the activity
const deleteActivity = async (_id: string) => {
  try {
    const { data } = await useFetch<any>(`/api/activities/${_id}`, {
      method: "DELETE",
    });
    if (data.value && data.value.success) {
      // Handle successful deletion (e.g., update UI, show notification)
      console.log("Category deleted successfully");
      await refresh(); // Refresh the activities lis
      // You might want to refresh your users list or navigate away
    } else {
      // Handle error from server
      console.error("Failed to delete user:", data.value!.error);
    }
    isDeleteDialogOpen.value = false;
  } catch (error) {
    console.error("Error calling delete endpoint:", error);
    throw error;
  }
};
</script>

<style></style>
