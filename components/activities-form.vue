<template>
  <div class="p-4">
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <div class="flex flex-col space-y-4">
        <UFormField label="Activity Name" name="name">
          <UInput
            v-model="state.label"
            placeholder="e.g.: Gym, Valorant, Reading"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Category" name="category">
          <USelect
            v-model="state.category"
            :items="categories!"
            value-key="_id"
            label-key="name"
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
import type { IActivity } from "~/interfaces/activities";
import type { Reactive } from "vue";
import type { ICategory } from "~/interfaces/categories";

const props = defineProps<{
  initialData: IActivity | null;
}>();

const emit = defineEmits(["submit", "cancel"]);

const { data: categories, refresh } = await useFetch<ICategory[]>(
  "/api/categories"
);

const schema = v.object({
  label: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  category: v.pipe(v.string(), v.minLength(1, "Please select a category")),
});

type Schema = v.InferOutput<typeof schema>;

const state: Reactive<{ label: string; category: string }> = reactive({
  label: "",
  category: "",
});

// Initialize form with data if editing
onMounted(() => {
  if (props.initialData) {
    state.label = props.initialData.label;
    state.category = props.initialData.category_id._id!;
  }
});

// Watch for changes in initialData
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      state.label = newVal.label;
      state.category = newVal.category_id._id!;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  state.label = "";
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
