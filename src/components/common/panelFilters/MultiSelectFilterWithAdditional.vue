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

function onChange() {
  if (localValue.value.length != 0) {
    const lastIndex = localValue.value.length - 1
    const lastEl = localValue.value[(lastIndex)] as string
    if (["NOT_EMPTY", "EMPTY"].includes(lastEl)) {
      localValue.value.length = 0
      localValue.value.push(lastEl)
    } else {
      localValue.value = localValue.value.filter(item => !["NOT_EMPTY", "EMPTY"].includes(item))
    }
  }
  emit('update:value', props.valueKey, localValue.value)
}

const filterOption = (input: string, option: any) => {
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
              :filter-option="filterOption"
              mode="multiple"
              max-tag-count="responsive"
              :allowClear="true"
              :placeholder="placeholder"
              v-model:value="localValue"
              @change="onChange">
      <a-select-option value="EMPTY"
                       key="EMPTY"
                       title="Пусто">
        Пусто
      </a-select-option>
      <a-select-option value="NOT_EMPTY"
                       key="NOT_EMPTY"
                       title="Не пусто">
        Не пусто
      </a-select-option>
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
