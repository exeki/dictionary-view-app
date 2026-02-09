<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";

interface Props {
  exportFileLimit: number
  total: number
  pageSize: number
  lastExportedPage: number
}

interface Emits {
  (e: 'update:submit', startPage: number, endPage: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const show = ref<boolean>(false)
const startPage = ref<number>(0)
const endPage = ref<number>(0)
const maxPage = ref<number>(0)
const maxEndPage = ref<number>(0)

onMounted(() => {
  initPageValues()
})

function initPageValues() {
  maxPage.value = Math.ceil(props.total / props.pageSize)
  if (props.lastExportedPage == maxPage.value) startPage.value = 1
  else startPage.value = props.lastExportedPage + 1
  recalculateEndPage()
}

function recalculateEndPage() {
  const maxPageFromStartPage = Math.ceil(props.exportFileLimit / props.pageSize) + startPage.value - 1
  endPage.value = maxPage.value < maxPageFromStartPage ? maxPage.value : maxPageFromStartPage
  maxEndPage.value = maxPageFromStartPage < maxPage.value ? maxPageFromStartPage : maxPage.value
}

function showModal() {
  initPageValues()
  show.value = true
}

function hideModal() {
  show.value = false
}

function submit() {
  emit("update:submit", startPage.value, endPage.value)
  hideModal()
}

defineExpose({
  showModal,
  hideModal
})
</script>

<template>
  <a-modal title="Экспорт большого числа объектов" :open="show" :closable=false>
    <a-space direction="vertical">
      <a-typography-text>
        Общее количество объектов для единоразового экспорта слишком велико. Пожалуйста, укажите объекты для экспорта
        с помощью указания первой и последней страниц отрезка включительно. Обратите внимание на количество экспортируемых страниц.
        При необходимости повторите итерацию с указанием необходимого отрезка страниц.
      </a-typography-text>
      <a-typography-text>Количество объектов на странице: {{ pageSize }}</a-typography-text>
      <a-typography-text>Всего страниц: {{ maxPage }}</a-typography-text>
      <a-typography-text v-if="lastExportedPage != 0">
        Последняя выгруженная страница: {{ lastExportedPage }}
      </a-typography-text>
      <div class="vertical">
        <a-typography-text strong>Первая страница для экспорта:</a-typography-text>
        <a-input-number v-model:value="startPage"
                        @change="recalculateEndPage"
                        :min="1"
                        :max="maxPage"/>
      </div>
      <div class="vertical">
        <a-typography-text strong>Последняя страница для экспорта:</a-typography-text>
        <a-input-number v-model:value="endPage"
                        :min="startPage"
                        :max="maxEndPage"/>
      </div>
      <a-typography-text>Максимум объектов для экспорта: {{ exportFileLimit }}</a-typography-text>
      <a-typography-text>
        Количество объектов в указанном диапазоне: {{ (endPage * pageSize) - ((startPage - 1) * pageSize) }}
      </a-typography-text>
    </a-space>
    <template #footer>
      <a-space class="left-align-container">
        <a-button class="ok" type="primary" @click="submit" style="min-width: 80px !important;">
          <span>OK</span>
        </a-button>
        <a-button class="ok" type="primary" @click="hideModal" style="min-width: 80px !important;">
          <span>Отмена</span>
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
.vertical {
  display: flex;
  flex-direction: column;
}
</style>
