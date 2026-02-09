<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

interface Props {
  title: string
  placeholder?: string
  value: boolean | null
  valueKey: string
}

interface Emits {
  (e: 'update:value', key: string, value: boolean | null): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const localValue = ref<boolean | null>(null)
const localStringValue = ref<string | null>(null)

onMounted(() => {
  localValue.value = props.value
  if (props.value != null) localStringValue.value = props.value?.toString()
  else localStringValue.value = null
})

watch(() => props.value, (newVal) => {
  localValue.value = newVal
  if (newVal != null) localStringValue.value = newVal?.toString()
  else localStringValue.value = null
})

function onChange() {
  localValue.value = stringToBoolean(localStringValue.value)
  emit('update:value', props.valueKey, localValue.value)
}

function stringToBoolean(str: string | null): boolean | null {
  let val: boolean | null = null
  if (str == 'true') val = true
  if (str == 'false') val = false
  return val
}

</script>

<template>
  <div class="filter">
    <span class="filter-panel-title">{{ title }}</span>
    <a-select class="filter-panel-input"
              max-tag-count="responsive"
              :allowClear="true"
              :placeholder="placeholder"
              v-model:value="localStringValue"
              @change="onChange">
      <a-select-option :value="'true'" :key="'true'">Да</a-select-option>
      <a-select-option :value="'false'" :key="'false'">Нет</a-select-option>
    </a-select>
  </div>
</template>

<style scoped>
.filter-panel-title {
  display: flex;
  align-items: center;
}
</style>
