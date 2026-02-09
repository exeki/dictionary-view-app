<script setup lang="ts">
import {ref, watch} from "vue";
import type SelectOption from "../../../model/nsd/SelectOption.ts";
import {FilterConfirmProps} from "ant-design-vue/es/table/interface";

interface Props {
  confirm: (param?: FilterConfirmProps) => void;
  value: string[] | null
  valueKey: string
  options: SelectOption[]
}

interface Emits {
  (e: 'update:value', newFiltration: Record<string, any>): void
  (e: 'update:filter', newFiltration: Record<string, any>): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const selectedValues = ref<string[]>([])
const localOptions = ref<SelectOption[] | null>(props.options)

function clear() {
  selectedValues.value.length = 0
  emit('update:value', {[props.valueKey]: selectedValues.value})
}

function apply() {
  emit('update:filter', {[props.valueKey]: selectedValues.value})
  props.confirm({closeDropdown: true})
}

const searchValue = ref('')

watch(() => props.value, (newVal) => {
  selectedValues.value.length = 0
  if (newVal != null) selectedValues.value.push(...newVal)
})

// Обработчик поиска
function handleSearch() {
  console.log(searchValue.value)
  if (searchValue.value) localOptions.value = props.options.filter(option =>
      option.label.toLowerCase().includes(searchValue.value.toLowerCase())
  )
  else localOptions.value = props.options
}

function onChange() {
  if (selectedValues.value.length != 0) {
    const lastIndex = selectedValues.value.length - 1
    const lastEl = selectedValues.value[(lastIndex)] as string
    if (["NOT_EMPTY", "EMPTY"].includes(lastEl)) {
      selectedValues.value.length = 0
      selectedValues.value.push(lastEl)
    } else {
      selectedValues.value = selectedValues.value.filter(item => !["NOT_EMPTY", "EMPTY"].includes(item))
    }
  }
  emit('update:value', {[props.valueKey]: selectedValues.value})
}
</script>

<template>
  <div class="filter-dropdown">
    <div class="vertical">
      <!--Пусто/не пусто-->
      <a-checkbox-group class="options-container" v-model:value="selectedValues" @change="onChange">

        <div class="global-options-container">
          <div class="option-item">
            <a-checkbox key="EMPTY"
                        value="EMPTY">
              <span class="option-label">Пусто</span>
            </a-checkbox>
          </div>
          <div class="option-item">
            <a-checkbox key="NOT_EMPTY"
                        value="NOT_EMPTY">
              <span class="option-label">Не пусто</span></a-checkbox>
          </div>
        </div>
        <!-- Поиск -->
        <div class="search">
          <a-input v-model:value="searchValue"
                   placeholder="Поиск в фильтрах"
                   @change="handleSearch"/>
        </div>
        <!--Опции фильтрации-->
        <div class="option-item"
             v-for="option in localOptions"
             :key="option.value">
          <a-checkbox :value="option.value" :key="option.value" :title="option.label">
            <span class="option-label">{{ option.label }}</span>
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
    <!--Кнопки-->
    <div class="buttons-container" style="display: flex; justify-content: space-between; margin-top: 10px">
      <a-button type="link"
                size="small"
                @click="clear"
                :disabled="selectedValues.length == 0">
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
.filter-dropdown {
  min-width: 200px;
}

.global-options-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 8px 0 8px;
  width: 100%;
}

.search {
  padding: 8px;
}

.options-container {
  width: 100%;
  overflow-y: auto;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 8px 8px;
}

.buttons-container {
  padding-bottom: 8px;
}

.option-item {
  padding: 4px;
  width: 100%;
  border-radius: 5px;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-label {
  margin-left: 8px;
}

.no-results {
  text-align: center;
  padding: 16px;
  color: #999;
  font-style: italic;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.vertical {
  display: flex;
  flex-direction: column;
}
</style>
