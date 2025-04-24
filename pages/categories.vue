<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <UButton color="primary" @click="openAddModal">Add Category</UButton>
    </div>

    <!-- Categories Table -->
    <UTable :columns="columns" :data="categories!" :loading="loading">
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
          <UButton color="error" @click="deleteCategory(currentCategory!._id!)"
            >Delete</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { ICategory } from "~/interfaces/categories";

const { data: categories, refresh } = await useFetch<ICategory[]>(
  "/api/categories"
);

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

const loading = ref(false);
const isModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditing = ref(false);
const currentCategory: Ref<ICategory | null> = ref(null);

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
const handleFormSubmit = async (formData: any) => {
  if (isEditing.value && currentCategory.value) {
    try {
      const { data, error } = await useFetch(
        `/api/categories/${currentCategory.value._id}`,
        {
          method: "patch",
          body: {
            name: formData.name,
            icon: formData.icon,
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
    // Add new category
    loading.value = true;
    try {
      await $fetch("/api/categories", {
        method: "POST",
        body: {
          name: formData.name,
          icon: formData.icon,
        },
      });
      // Refresh the categories list
      await refresh();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      loading.value = false;
    }
  }

  isModalOpen.value = false;
};

// Delete the category
const deleteCategory = async (_id: string) => {
  try {
    const { data } = await useFetch<any>(`/api/categories/${_id}`, {
      method: "DELETE",
    });
    if (data.value && data.value.success) {
      // Handle successful deletion (e.g., update UI, show notification)
      console.log("Category deleted successfully");
      await refresh(); // Refresh the categories lis
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
