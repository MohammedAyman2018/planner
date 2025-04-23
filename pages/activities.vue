<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Activities</h1>
      <UButton color="primary" @click="openAddModal">Add Activity</UButton>
    </div>

    <!-- Activities Table -->

    <UTable :columns="columns" :data="activities" :loading="loading">
      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          {{ row.original.category.label }}
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
              currentActivity?.name
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
          <UButton color="error" @click="deleteActivity">Delete</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
// Table columns definition
const columns = ref([
  {
    accessorKey: "name",
    header: "Name",
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
const activities = ref([
  {
    id: 1,
    name: "Morning Workout",
    category: { id: "health", label: "Health" },
  },
  {
    id: 2,
    name: "Team Meeting",
    category: { id: "entertainment", label: "Entertainment" },
  },
  {
    id: 3,
    name: "Valorant Gaming",
    category: { id: "family", label: "Family" },
  },
  { id: 4, name: "Reading", category: { id: "work", label: "Work" } },
]);

const loading = ref(false);
const isModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditing = ref(false);
const currentActivity: Ref<{
  category: string;
  name: string;
  id: number;
} | null> = ref(null);

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
    category: activity.original.category.id,
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
const handleFormSubmit = (formData: FormData) => {
  if (isEditing.value) {
    // Update existing activity
    const index = activities.value.findIndex(
      //@ts-ignore
      (a) => a.id === currentActivity.value.id
    );
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...formData };
    }
  } else {
    // Add new activity
    const newId =
      activities.value.length > 0
        ? Math.max(...activities.value.map((a) => a.id)) + 1
        : 1;
    //@ts-ignore
    activities.value.push({ id: newId, ...formData });
  }

  isModalOpen.value = false;
};

// Delete the activity
const deleteActivity = () => {
  activities.value = activities.value.filter(
    (a) => a.id !== currentActivity.value!.id
  );
  isDeleteDialogOpen.value = false;
};
</script>

<style></style>
