<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {FilterConfirmProps} from "ant-design-vue/es/table/interface";

interface Props {
  confirm: (param?: FilterConfirmProps) => void;
  value: string | null
  valueKey: string
}

interface Emits {
  (e: 'update:value', newFiltration: Record<string, any>): void
  (e: 'update:filter', newFiltration: Record<string, any>): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const localValue = ref<string | null>(null)

onMounted(() => {
  localValue.value = props.value
})

function clear() {
  localValue.value = null
  emit('update:value', {[props.valueKey]: localValue.value})
}

function apply() {
  if (props.value != localValue.value) emit('update:filter', {[props.valueKey]: localValue.value})
  props.confirm({closeDropdown: true})
}

function onChange() {
  emit('update:value', {[props.valueKey]: localValue.value})
}

watch(() => props.value, (newVal) => localValue.value = newVal)

</script>

<template>
  <div style="padding: 8px">
    <a-input style="margin-bottom: 8px; display: block; width: 180px"
             v-model:value="localValue"
             @change="onChange"
             @pressEnter="apply"/>
    <div style="display: flex; justify-content: space-between;">
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

</style>
