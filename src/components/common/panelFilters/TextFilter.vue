<script setup lang="ts">
import {ref, watch} from "vue";

interface Props {
  title: string
  placeholder?: string
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
    <a-input class="filter-panel-input"
             :placeholder="placeholder"
             :allowClear="true"
             v-model:value="localValue"
             @change="emit('update:value', valueKey, localValue?.trim() == '' ? null : localValue)"/>
  </div>
</template>

<style scoped>

</style>
