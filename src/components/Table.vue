<!--suppress VueUnrecognizedSlot -->
<script setup lang="ts">
import InitialData from "../model/nsd/InitialData.ts";
import {reactive, ref, onMounted, toRaw, watch} from "vue";
import {connector, devMode} from "../main.ts";
import Pagination from "../model/ant/Pagination.ts";
import Sorter from "../model/nsd/Sorter.ts";
import Filter from "../model/nsd/Filter.ts";
import ElementDto from "../model/nsd/ElementDto.ts";
import ExportButton from "./buttons/ExportButton.vue";
import MostBeautifulJsonEver from "./common/MostBeautifulJsonEver.vue";
import FilterPanel from "./FilterPanel.vue";
import SortState from "../model/ant/SortState.ts";
import TextFilterDropdown from "./common/filterDropdown/TextFilterDropdown.vue";
import HyperLink from "./common/HyperLink.vue";
import {FilterOutlined} from "@ant-design/icons-vue";
import CatalogType from "../model/nsd/CatalogType.ts";
import BooleanFilterDropdown from "./common/filterDropdown/BooleanFilterDropdown.vue";
import ColorBarge from "./common/ColorBarge.vue";
import {notification} from "ant-design-vue";
import DeleteButton from "./buttons/DeleteButton.vue";
import EditButton from "./buttons/EditButton.vue";
import CreateButton from "./buttons/CreateButton.vue";
import SpanWithCopyButton from "./buttons/SpanWithCopyButton.vue";

interface Props {
  initData: InitialData,
  catalogType: CatalogType,
  tableMode: 'hierarchy' | 'flat'
}

const props = defineProps<Props>()

onMounted(() => {
  getPage()
  setSortingState(defaultSorter)
})

/** Список для отрисовки на таблице */
const elements = ref<ElementDto[]>([])
/** Состояние загрузки */
const loading = ref<boolean>(false)
/** Конфигурация пагинации */
const pagination = reactive<Pagination>({
  position: ['bottomLeft', 'topLeft'],
  current: 1,
  pageSize: devMode ? 5 : 20,
  total: 1,
  showTotal: (total: number) => "Всего: " + total,
  size: 'small',
  pageSizeOptions: devMode ? [5, 20, 50, 100] : [20, 50, 100],
  hideOnSinglePage: false,
  defaultCurrent: 1,
  showQuickJumper: true
})
/** Конфигурация сортировки по умолчанию */
const defaultSorter = reactive<Sorter>({
  columnKey: "title",
  order: "descend"
})
/** Конфигурация сортировки для отправки на бек */
const sorter = reactive<Sorter>({...toRaw(defaultSorter)})
/** Конфигурация сортировки по столбцам */
const sortingState = reactive<SortState>({
  title: null,
  code: null,
  parentCode: null,
  parentTitle: null
})
/** Сохраненное состояние фильтрации по умолчанию */
const defaultFiltration = reactive<Filter>({
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
/** Конфигурация фильтрации */
const filtration = reactive<Filter>({...toRaw(defaultFiltration)})
/** Кнопка экспорта */
const exportButton = ref()
/** Панель фильтрации */
const filterPanel = ref()
/** Состояние кнопки фильтрации */
const filterGhost = ref(false)
/** Отобразить столбцы с параметрами родителя */
const showParentParams = ref<boolean>(false)

/** Получить страницу по текущим параметрами  */
async function getPage(): Promise<void> {
  loading.value = true
  await connector.getPage({tableMode: props.tableMode}, filtration, sorter, pagination, props.catalogType.value).then(data => {
    elements.value.length = 0
    pagination.total = data.pager.total
    elements.value = data.elements
    if (data.elements.length == 0 && data.pager.total != 0) {
      pagination.current = Math.ceil(data.pager.total / pagination.pageSize)
      getPage()
    }
  }).catch((e) => {
    notification.error({
      message: 'Ошибка при получении списка',
      description: e.message,
      duration: 5
    })
  }).finally(() => loading.value = false)
}

/**
 * Обновить состояние сортировки
 * @param newSorter текущая сортировка
 */
function setSortingState(newSorter: Sorter) {
  if (sorter.columnKey != newSorter.columnKey || sorter.order != newSorter.order) exportButton.value.zeroLastExportedPage()
  Object.assign(sorter, newSorter)
  for (const key in sortingState) {
    (sortingState as any)[key] = (key == sorter.columnKey ? sorter.order : null)
  }
}

/**
 * Обработчик изменения таблицы (пагинация, сортировка, фильтрация)
 * @param newPagination новое состояние пагинации
 * @param newFiltration новое состояние фильтрации
 * @param newSorting новое состояние сортировки
 */
function handleTableChange(newPagination: Pagination, newFiltration: Filter, newSorting: Sorter) {
  if (pagination.pageSize != newPagination.pageSize) exportButton.value.zeroLastExportedPage()
  Object.assign(pagination, newPagination)
  setSortingState(newSorting)
  //встроенных фильтров все ровно нет
  //Object.assign(filtration, newFiltration)
  newFiltration
  getPage()
}

/**
 * Обработчик изменения фильтрации
 * @param newFiltration полное или частичное изменение состояния фильтрации
 */
function handleFiltrationChange(newFiltration: Record<string, any>) {
  pagination.current = 1
  exportButton.value.zeroLastExportedPage()
  setFiltrationValues(newFiltration)
  handleTableChange(pagination, filtration, sorter)
}

/** Обновить значение фильтрации */
function setFiltrationValues(newFiltration: Record<string, any>) {
  Object.assign(filtration, newFiltration)
}

/**
 * Очистить все фильтры
 */
function clearAllFilters(refresh: boolean = true) {
  Object.assign(filtration, defaultFiltration)
  if (refresh) handleFiltrationChange(filtration)
}

/**
 * Очистить сортировку
 */
function clearAllSorting(refresh: boolean = true) {
  sorter.order = null
  sorter.columnKey = null
  if (refresh) getPage()
}

/** Выполняется при закрытии выпадающего фильтра таблицы  */
function onFilterDropdownOpenChange(open: boolean) {
  if (!open) handleTableChange(pagination, filtration, sorter)
}

/**
 * Заново подгрузить данные при смене вводных
 */
function reInitTable() {
  pagination.current = 1
  elements.value.length = 0
  setSortingState(toRaw(defaultSorter))
  setFiltrationValues(toRaw(defaultFiltration))
  getPage()
}

watch(() => props.catalogType, reInitTable)
watch(() => props.tableMode, reInitTable)
</script>

<template>
  <a-space direction="horizontal" class="table-operations">
    <CreateButton :catalog-type="catalogType" @update:added="getPage"/>
    <a-button class="filter--button op-button"
              :ghost="filterGhost"
              type="primary"
              @click="() => filterPanel.switchOpen()">
      <span> Фильтрация</span>
      <template #icon>
        <FilterOutlined/>
      </template>
    </a-button>
    <a-button class="reset-filter-button op-button" type="primary" @click="clearAllFilters">Сброс фильтрации</a-button>
    <a-button class="reset-sort-button op-button" type="primary" @click="clearAllSorting">Сброс сортировки</a-button>
    <ExportButton ref="exportButton"
                  v-if="tableMode == 'flat'"
                  :filtration="filtration"
                  :sorter="sorter"
                  :exportFileLimit="initData.exportFileLimit"
                  :total="pagination.total"
                  :catalogType="catalogType"
                  :pageSize="pagination.pageSize"/>
    <a-checkbox v-if="tableMode == 'flat' && (catalogType.isWithFolders || !catalogType.isFlat)"
                v-model:checked="showParentParams">
      Отобразить расширенные параметры родителя
    </a-checkbox>
  </a-space>
  <FilterPanel ref="filterPanel"
               :filtration="filtration"
               :initialData="initData"
               :defaultFiltration="defaultFiltration"
               :tableMode="tableMode"
               @update:filter="handleFiltrationChange"
               @update:clear="clearAllFilters"
               @update:switch="(open : boolean) => filterGhost = open"/>
  <a-table class="support-objects-table"
           size="small"
           :bordered="true"
           :selections="true"
           :data-source="elements"
           :pagination="pagination"
           :loading="loading"
           :scroll="{ x: 500 }"
           @change="handleTableChange">
    <a-table-column title="DEBUG"
                    v-if="false"
                    data-index="key"
                    key="key">
      <template #customRender="{record}">
        <a-popover>
          <template #content>
            <MostBeautifulJsonEver :data="record"/>
          </template>
          <a-button type="primary">{{ record.key }}</a-button>
        </a-popover>
      </template>
    </a-table-column>
    <a-table-column title="В архиве"
                    data-index="removed"
                    key="removed"
                    :filteredValue="filtration.removed?.toString()"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange">
      <template #customRender="{record}">
        <span class="first-cell">{{ record.removed ? "Да" : "Нет" }}</span>
      </template>
      <template #filterDropdown="{confirm}">
        <BooleanFilterDropdown valueKey="removed"
                               :confirm="confirm"
                               :value="filtration.removed"
                               @update:value="setFiltrationValues"
                               @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Код"
                    data-index="code"
                    key="code"
                    :customFilterDropdown="true"
                    :sortOrder="sortingState.code"
                    :filteredValue="filtration.code"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    :sorter="true">
      <template #customRender="{record}">
        <SpanWithCopyButton :text="record.code"/>
      </template>
      <template #filterDropdown="{confirm}">
        <TextFilterDropdown valueKey="code"
                            :confirm="confirm"
                            :value="filtration.code"
                            @update:value="setFiltrationValues"
                            @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Наименование"
                    data-index="title"
                    key="title"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    :filteredValue="filtration.title"
                    :sortOrder="sortingState.title"
                    :sorter="true">
      <template #customRender="{record}">
        <HyperLink :title="record.title" :uuid="record.uuid"/>
      </template>
      <template #filterDropdown="{confirm}">
        <TextFilterDropdown valueKey="title"
                            :confirm="confirm"
                            :value="filtration.title"
                            @update:value="setFiltrationValues"
                            @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Цвет"
                    data-index="color"
                    key="color">
      <template #customRender="{record}">
        <ColorBarge :color="record.color"/>
      </template>
    </a-table-column>
    <a-table-column title="Является папкой"
                    v-if="catalogType.isWithFolders"
                    data-index="folder"
                    key="folder"
                    :filteredValue="filtration.folder?.toString()"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange">
      <template #customRender="{record}">
        <span>{{ record.folder ? "Да" : "Нет" }}</span>
      </template>
      <template #filterDropdown="{confirm}">
        <BooleanFilterDropdown valueKey="folder"
                               :confirm="confirm"
                               :value="filtration.folder"
                               @update:value="setFiltrationValues"
                               @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Родитель в архиве"
                    v-if="showParentParams && tableMode == 'flat'"
                    data-index="parentRemoved"
                    key="parentRemoved"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    :filteredValue="filtration.parentRemoved?.toString()">
      <template #customRender="{record}">
        <span v-if="record.parent">{{ record.parent.removed ? "Да" : "Нет" }}</span>
      </template>
      <template #filterDropdown="{confirm}">
        <BooleanFilterDropdown valueKey="parentRemoved"
                               :confirm="confirm"
                               :value="filtration.parentRemoved"
                               @update:value="setFiltrationValues"
                               @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Код родителя"
                    v-if="showParentParams  && tableMode == 'flat'"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    data-index="parentCode"
                    key="parentCode"
                    :filteredValue="filtration.parentCode"
                    :sortOrder="sortingState.parentCode"
                    :sorter="true">
      <template #customRender="{record}">
        <SpanWithCopyButton v-if="record.parent" :text="record.parent.code"/>
      </template>
      <template #filterDropdown="{confirm}">
        <TextFilterDropdown valueKey="parentCode"
                            :confirm="confirm"
                            :value="filtration.parentCode"
                            @update:value="setFiltrationValues"
                            @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Родитель"
                    v-if="tableMode == 'flat' && (catalogType.isWithFolders || !catalogType.isFlat)"
                    data-index="parentTitle"
                    key="parentTitle"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    :filteredValue="filtration.parentTitle"
                    :sortOrder="sortingState.parentTitle"
                    :sorter="true">
      <template #customRender="{record}">
        <HyperLink v-if="record.parent" :title="record.parent.title" :uuid="record.parent.uuid"/>
      </template>
      <template #filterDropdown="{confirm}">
        <TextFilterDropdown valueKey="parentTitle"
                            :confirm="confirm"
                            :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                            :value="filtration.parentTitle"
                            @update:value="setFiltrationValues"
                            @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title="Цвет родителя"
                    v-if="showParentParams && !catalogType.isFlat  && tableMode == 'flat'"
                    data-index="parentColor"
                    key="parentColor">
      <template #customRender="{record}">
        <ColorBarge v-if="record.parent" :color="record.parent.color"/>
      </template>
    </a-table-column>
    <a-table-column title="Родитель является папкой"
                    v-if="showParentParams && catalogType.isWithFolders  && tableMode == 'flat'"
                    data-index="parentFolder"
                    key="parentFolder"
                    :onFilterDropdownOpenChange="onFilterDropdownOpenChange"
                    :filteredValue="filtration.parentFolder?.toString()">
      <template #customRender="{record}">
        <span v-if="record.parent">{{ record.parent.folder ? "Да" : "Нет" }}</span>
      </template>
      <template #filterDropdown="{confirm}">
        <BooleanFilterDropdown valueKey="parentFolder"
                               :confirm="confirm"
                               :value="filtration.parentFolder"
                               @update:value="setFiltrationValues"
                               @update:filter="handleFiltrationChange"/>
      </template>
    </a-table-column>
    <a-table-column title=" ">
      <template #customRender="{record}">
        <div class="buttons">
          <EditButton :catalogType="catalogType" :element="record" @update:edited="getPage"/>
          <DeleteButton :element="record" @update:deleted="getPage"/>
        </div>
      </template>
    </a-table-column>
  </a-table>
</template>

<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
}
</style>
