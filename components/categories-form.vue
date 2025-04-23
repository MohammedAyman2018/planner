<template>
  <div class="p-4">
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <div class="flex flex-col space-y-4">
        <UFormField label="Category Name" name="name">
          <UInput
            v-model="state.name"
            placeholder="e.g.: Health, Work, Education"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Icon" name="icon">
          <USelect
            v-model="state.icon"
            :items="icons"
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
  initialData: { name: string; icon: string; id: string } | null;
}>();

const emit = defineEmits(["submit", "cancel"]);

const icons = [
  { id: "i-lucide-heart", label: "Health" },
  { id: "i-lucide-briefcase", label: "Work" },
  { id: "i-lucide-book", label: "Education" },
  { id: "i-lucide-users", label: "Family" },
  { id: "i-lucide-gamepad-2", label: "Entertainment" },
  { id: "i-lucide-dumbbell", label: "Sports" },
  { id: "i-lucide-users", label: "Social" },
  { id: "i-lucide-more-horizontal", label: "Other" },
];

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  icon: v.pipe(v.string(), v.minLength(1, "Please select an icon")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: "",
  icon: "",
});

// Initialize form with data if editing
onMounted(() => {
  if (props.initialData) {
    state.name = props.initialData.name;
    state.icon = props.initialData.icon;
  }
});

// Watch for changes in initialData
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      state.name = newVal.name;
      state.icon = newVal.icon;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  state.name = "";
  state.icon = "";
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