<script setup lang="ts">
import type SelectOption from "../../../model/nsd/SelectOption.ts";
import {ref, watch} from "vue";

interface Props {
  title: string
  placeholder?: string
  options: SelectOption[]
  value: string[] | null
  valueKey: string
}

interface Emits {
  (e: 'update:value', key: string, value: string[] | null): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const localValue = ref<string[]>(props.value == null ? [] : props.value)

const filterOption = (input: string, option: any) => {
  console.log(input)
  console.log(option)
  if (!input) return true
  return option.title?.toLowerCase()?.includes(input.toLowerCase())
}

watch(() => props.value, (newVal) => localValue.value = newVal == null ? [] : newVal)
</script>

<template>
  <div class="filter">
    <span class="filter-panel-title">{{ title }}</span>
    <a-select class="filter-panel-input"
              show-search
              mode="multiple"
              :filter-option="filterOption"
              max-tag-count="responsive"
              :allowClear="true"
              :placeholder="placeholder"
              v-model:value="localValue"
              @change="emit('update:value', valueKey, localValue)">
      <a-select-option v-for="option in options" :value="option.value" :key="option.value" :title="option.label">
        {{ option.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<style scoped>
.filter-panel-title {
  display: flex;
  align-items: center;
}
</style>
