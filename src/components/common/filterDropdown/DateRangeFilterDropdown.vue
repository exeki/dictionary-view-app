<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import dayjs, {Dayjs} from 'dayjs';
import {FilterConfirmProps} from "ant-design-vue/es/table/interface";

interface Props {
  confirm: (param?: FilterConfirmProps) => void;
  valueFrom: string | null
  valueTo: string | null
  valueKeyFrom: string
  valueKeyTo: string
}

interface Emits {
  (e: 'update:value', newFiltration: Record<string, any>): void

  (e: 'update:filter', newFiltration: Record<string, any>): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const localValueFrom = ref<string | null>(null)
const localValueTo = ref<string | null>(null)

onMounted(() => {
  localValueFrom.value = props.valueFrom
  localValueTo.value = props.valueTo
})

function clear() {
  localValueFrom.value = null
  localValueTo.value = null
  emit('update:value', {[props.valueKeyFrom]: localValueFrom.value, [props.valueKeyTo]: localValueTo.value})
}

function apply() {
  if (props.valueFrom != localValueFrom.value || props.valueTo != localValueTo.value)
    emit('update:filter', {[props.valueKeyFrom]: localValueFrom.value, [props.valueKeyTo]: localValueTo.value})
  props.confirm({closeDropdown: true})
}

function onChangeFrom() {
  emit('update:value', {[props.valueKeyFrom]: localValueFrom.value})
}

function onChangeTo() {
  emit('update:value', {[props.valueKeyTo]: localValueTo.value})
}

const disabledDateFrom = (current: Dayjs) => {
  if (localValueTo.value) return current.startOf('day') > dayjs(localValueTo.value, format.value).startOf('day')
  else return false
}

const disabledDateTo = (current: Dayjs) => {
  if (localValueFrom.value) return current.startOf('day') < dayjs(localValueFrom.value, format.value).startOf('day')
  else return false
}

const format = ref<string>("DD.MM.YYYY")

watch(() => props.valueFrom, (newVal) => localValueFrom.value = newVal)
watch(() => props.valueTo, (newVal) => localValueTo.value = newVal)

</script>

<template>
  <div style="padding: 8px">
    <a-date-picker class="data-picker-from"
        v-model:value="localValueFrom"
                   placeholder="C"
                   :format="format"
                   :value-format="format"
                   :disabledDate="disabledDateFrom"
                   @change="onChangeFrom"
                   @pressEnter="apply"/>
    <a-date-picker class="data-picker-to"
                   v-model:value="localValueTo"
                   placeholder="По"
                   :format="format"
                   :value-format="format"
                   :disabledDate="disabledDateTo"
                   @change="onChangeTo"
                   @pressEnter="apply"/>
    <div style="display: flex; justify-content: space-between; margin-top: 10px">
      <a-button type="link"
                size="small"
                @click="clear"
                :disabled="localValueTo == null && valueTo == null && localValueFrom == null && valueFrom == null">
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
.data-picker-from {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.data-picker-to {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
</style>
