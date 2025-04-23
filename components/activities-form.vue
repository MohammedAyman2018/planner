<template>
  <div class="p-4">
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <div class="flex flex-col space-y-4">
        <UFormField label="Activity Name" name="name">
          <UInput
            v-model="state.name"
            placeholder="e.g.: Gym, Valorant, Reading"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Category" name="category">
          <USelect
            v-model="state.category"
            :items="categories"
            value-key="id"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="flex justify-end space-x-3 mt-5">
        <UButton type="button" variant="outline" @click="onCancel">
          Cancel
        </UButton>
        <UButton type="submit" color="primary"> Save </UButton>
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  initialData: { category: string; name: string; id: number } | null;
}>();

const emit = defineEmits(["submit", "cancel"]);

const categories = [
  { id: "health", label: "Health" },
  { id: "entertainment", label: "Entertainment" },
  { id: "family", label: "Family" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "sports", label: "Sports" },
  { id: "social", label: "Social" },
  { id: "other", label: "Other" },
];

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  category: v.pipe(v.string(), v.minLength(1, "Please select a category")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: "",
  category: "",
});

// Initialize form with data if editing
onMounted(() => {
  if (props.initialData) {
    state.name = props.initialData.name;
    state.category = props.initialData.category;
  }
});

// Watch for changes in initialData
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      console.log(newVal);

      state.name = newVal.name;
      state.category = newVal.category;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  state.name = "";
  state.category = "";
};

const onCancel = () => {
  emit("cancel");
};

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  emit("submit", event.data);
};
</script>

<style>
/* You can add custom CSS styles here */
</style>
