<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <UButton color="primary" @click="openAddModal">Add Category</UButton>
    </div>

    <!-- Categories Table -->
    <UTable :columns="columns" :data="categories" :loading="loading">
      <template #icon-cell="{ row }">
        <div class="flex items-center gap-2">
          <UIcon :name="row.original.icon" class="text-lg" />
        </div>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            color="warning"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            @click="editCategory(row)"
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
          {{ isEditing ? "Edit Category" : "Add Category" }}
        </div>
      </template>

      <template #body>
        <CategoriesForm
          :initial-data="currentCategory"
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
            Are you sure you want to delete the category "{{
              currentCategory?.name
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
          <UButton color="error" @click="deleteCategory">Delete</UButton>
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
    label: "Category Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    label: "Icon",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    label: "Actions",
  },
]);

// Sample categories data
const categories = ref([
  {
    id: "health",
    name: "Health",
    icon: "i-lucide-heart",
  },
  {
    id: "work",
    name: "Work",
    icon: "i-lucide-briefcase",
  },
  {
    id: "education",
    name: "Education",
    icon: "i-lucide-book",
  },
  {
    id: "family",
    name: "Family",
    icon: "i-lucide-users",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "i-lucide-gamepad-2",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "i-lucide-dumbbell",
  },
  {
    id: "social",
    name: "Social",
    icon: "i-lucide-users",
  },
  {
    id: "other",
    name: "Other",
    icon: "i-lucide-more-horizontal",
  },
]);

const loading = ref(false);
const isModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditing = ref(false);
const currentCategory: Ref<{
  name: string;
  icon: string;
  id: string;
} | null> = ref(null);

// Open modal for adding a new category
const openAddModal = () => {
  currentCategory.value = null;
  isEditing.value = false;
  isModalOpen.value = true;
};

// Open modal for editing a category
const editCategory = (category: any) => {
  currentCategory.value = {
    ...category.original,
  };
  isEditing.value = true;
  isModalOpen.value = true;
};

// Open confirmation dialog for deleting a category
const confirmDelete = (category: any) => {
  currentCategory.value = category.original;
  isDeleteDialogOpen.value = true;
};

// Handle form submission (add or edit)
const handleFormSubmit = (formData: any) => {
  if (isEditing.value && currentCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(
      (c) => c.id === currentCategory.value!.id
    );
    if (index !== -1) {
      categories.value[index] = { 
        ...categories.value[index], 
        name: formData.name,
        icon: formData.icon
      };
    }
  } else {
    // Add new category
    // Generate a slug-like ID from the name
    const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
    categories.value.push({ 
      id: newId, 
      name: formData.name,
      icon: formData.icon
    });
  }

  isModalOpen.value = false;
};

// Delete the category
const deleteCategory = () => {
  categories.value = categories.value.filter(
    (c) => c.id !== currentCategory.value!.id
  );
  isDeleteDialogOpen.value = false;
};
</script>

<style>

</style>