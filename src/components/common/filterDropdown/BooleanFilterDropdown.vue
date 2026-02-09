<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {FilterConfirmProps} from "ant-design-vue/es/table/interface";

interface Props {
  confirm: (param?: FilterConfirmProps) => void;
  value: boolean | null
  valueKey: string
}

interface Emits {
  (e: 'update:value', newFiltration: Record<string, any>): void

  (e: 'update:filter', newFiltration: Record<string, any>): void
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

function clear() {
  localValue.value = null
  emit('update:value', {[props.valueKey]: localValue.value})
}

function apply() {
  //emit('update:filter', {[props.valueKey]: localValue.value})
  props.confirm({closeDropdown: true})
}

function stringToBoolean(str: string | null): boolean | null {
  let val: boolean | null = null
  if (str == 'true') val = true
  if (str == 'false') val = false
  return val
}

function onChange() {
  emit('update:value', {[props.valueKey]: stringToBoolean(localStringValue.value)})
}

watch(() => props.value, (newVal) => {
  localValue.value = newVal
  if (newVal != null) localStringValue.value = newVal?.toString()
  else localStringValue.value = null
})

</script>

<template>
  <div style="padding: 8px" class="boolean-select">
    <a-select class="filter-panel-input"
              max-tag-count="responsive"
              :allowClear="true"
              v-model:value="localStringValue"
              @change="onChange">
      <a-select-option :value="'true'" :key="'true'">Да</a-select-option>
      <a-select-option :value="'false'" :key="'false'">Нет</a-select-option>
    </a-select>
    <div style="display: flex; justify-content: space-between; margin-top: 8px">
      <a-button type="link"
                size="small"
                @click="clear"
                :disabled="localValue == null && value == null ">
        Сбросить
      </a-button>
      <a-button type="primary"
                size="small"
                style="margin-right: 8px"
                @click="apply">
        OK
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.boolean-select {
  height: 75px;
}
</style>
