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

const localValueFrom = ref<string | null>(props.value)

watch(() => props.value, (newVal) => localValueFrom.value = newVal)

const format = ref<string>("DD.MM.YYYY")

</script>

<template>
  <div class="filter">
    <span class="filter-panel-title">{{ title }}</span>
    <a-date-picker class="filter-panel-input"
                   v-model:value="localValueFrom"
                   :placeholder="placeholder ? placeholder : ''"
                   :allowClear="true"
                   :format="format"
                   :value-format="format"
                   @change="emit('update:value', valueKey, localValueFrom)"/>
  </div>
</template>

<style scoped>

</style>
