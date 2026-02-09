<script setup lang="ts">


import {reactive, ref, watch} from "vue";
import InitialData from "../model/nsd/InitialData.ts";
import Filter from "../model/nsd/Filter.ts";
import TextFilter from "./common/panelFilters/TextFilter.vue";
import BooleanFilter from "./common/panelFilters/BooleanFilter.vue";

interface Props {
  filtration: Filter
  initialData: InitialData
  tableMode : 'flat' | 'hierarchy'
}

/**
 * Конфигурация фильтрации
 */
const localFiltration = reactive<Filter>({
  title: null,
  code: null,
  removed: null,
  folder: null,
  parentObject: null,
  parentTitle: null,
  parentCode: null,
  parentFolder: null,
  parentRemoved: null
})

interface Emits {
  (e: 'update:filter', newFiltration: Record<string, any>): void

  (e: 'update:clear'): void

  (e: 'update:switch', open: boolean): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const title = ref<string>("Фильтрация")

function handleEmit(key: string, value: any) {
  (localFiltration as any)[key] = value
}

watch(props.filtration, (newVal) => Object.assign(localFiltration, newVal))

function apply() {
  emit('update:filter', localFiltration)
  switchOpen()
}

function reset() {
  emit('update:clear')
  switchOpen()
}

const activeKey = ref<string[]>([])

function isOpen(): boolean {
  return !(activeKey.value.length == 0)
}

function switchOpen() {
  const open = isOpen()
  if (!open) activeKey.value.push("1")
  else activeKey.value.length = 0
  emit('update:switch', !open)
}


defineExpose({
  switchOpen,
  isOpen
})

</script>

<template>
  <a-collapse class="collapse" v-model:activeKey="activeKey">
    <a-collapse-panel key="1" :header="title">
      <a-space class="container" direction="horizontal" align="start">
        <a-space class="filter-column" direction="vertical" align="start">
          <TextFilter valueKey="title"
                      placeholder=" "
                      :value="localFiltration.title"
                      :title="'Наименование'"
                      @update:value="handleEmit"/>
          <TextFilter valueKey="code"
                      placeholder=" "
                      :value="localFiltration.code"
                      :title="'Код'"
                      @update:value="handleEmit"/>
          <BooleanFilter title="Является папкой"
                         valueKey="folder"
                         :value="localFiltration.folder"
                         @update:value="handleEmit"/>
          <BooleanFilter title="В архиве"
                         valueKey="removed"
                         :value="localFiltration.removed"
                         @update:value="handleEmit"/>
        </a-space>
        <a-space class="filter-column" direction="vertical" align="start" v-if="tableMode == 'flat'">
          <TextFilter valueKey="parentTitle"
                      :value="localFiltration.parentTitle"
                      :title="'Наименование родителя'"
                      @update:value="handleEmit"/>
          <TextFilter valueKey="parentCode"
                      placeholder=" "
                      :value="localFiltration.parentCode"
                      :title="'Код родителя'"
                      @update:value="handleEmit"/>
          <BooleanFilter title="Родитель является папкой"
                         valueKey="parentFolder"
                         :value="localFiltration.parentFolder"
                         @update:value="handleEmit"/>
          <BooleanFilter title="Родитель в архиве"
                         valueKey="parentRemoved"
                         :value="localFiltration.parentRemoved"
                         @update:value="handleEmit"/>
        </a-space>
      </a-space>
      <a-space class="buttons" direction="horizontal" style="width: 100%">
        <a-button class="button apply-button" type="primary" @click="apply">Применить</a-button>
        <a-button class="button reset-button" type="default" @click="reset">Сбросить</a-button>
      </a-space>
    </a-collapse-panel>
  </a-collapse>
</template>

<style scoped>
.buttons {
  margin-top: 15px;
}

.button {
  margin: 5px 5px 0 5px
}

.filter-panel-input {
  width: 330px;
  height: 30px;
}

.filter-panel-title {
  width: 210px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
}

.filter {
  display: flex;
  justify-content: flex-start;
}

.filter-column {
  margin-right: 30px;
}

.collapse {
  width: 100%;
}

.container {
  display: flex;
  flex-direction: row;
}

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }
}
</style>
