<script setup lang="ts">
import type SelectOption from "../../../model/nsd/SelectOption.ts";
import {ref, watch} from "vue";

interface Props {
  title: string
  placeholder?: string
  options: SelectOption[]
  value: string | null
  valueKey: string
}

interface Emits {
  (e: 'update:value', key: string, value: string | null): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const localValue = ref<string | null>(props.value)

watch(() => props.value, (newVal) => localValue.value = newVal)
</script>

<template>
  <div class="filter">
    <span class="filter-panel-title">{{ title }}</span>
    <a-select class="filter-panel-input"
              max-tag-count="responsive"
              :allowClear="true"
              :placeholder="placeholder"
              v-model:value="localValue"
              @change="emit('update:value', valueKey, localValue)">
      <a-select-option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</a-select-option>
    </a-select>
  </div>
</template>

<style scoped>
.filter-panel-title {
  display: flex;
  align-items: center;
}
</style>
