<script setup lang="ts">
import {ref, watch} from "vue";

interface Props {
  title: string
  placeholderFrom?: string
  placeholderTo?: string
  valueFrom: string | null
  valueTo: string | null
  valueKeyFrom: string
  valueKeyTo: string
}

interface Emits {
  (e: 'update:value', key: string, value: string | null): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const localValueFrom = ref<string | null>(props.valueFrom)
const localValueTo = ref<string | null>(props.valueTo)

watch(() => props.valueFrom, (newVal) => localValueFrom.value = newVal)
watch(() => props.valueTo, (newVal) => localValueTo.value = newVal)

const format = ref<string>("DD.MM.YYYY")

</script>

<template>
  <div class="filter">
    <span class="filter-panel-title">{{ title }}</span>
    <div class="filter-panel-input" style="display: flex;  justify-content: flex-start;">
      <a-date-picker class="data-picker data-picker-from"
          v-model:value="localValueFrom"
                     :placeholder="placeholderFrom ? placeholderFrom : ''"
                     :allowClear="true"
                     :format="format"
                     :value-format="format"
                     @change="emit('update:value', valueKeyFrom, localValueFrom)"/>
      <a-date-picker class="data-picker data-picker-to"
          v-model:value="localValueTo"
                     :placeholder="placeholderTo ? placeholderTo : ''"
                     :allowClear="true"
                     :format="format"
                     :value-format="format"
                     @change="emit('update:value', valueKeyTo, localValueTo)"/>
    </div>
  </div>
</template>

<style scoped>
.data-picker {
  width: 50%;
}
.data-picker-from {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.data-picker-to {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
</style>
