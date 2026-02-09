<script setup lang="ts">
import {ref} from "vue";
import type Sorter from "../../model/nsd/Sorter.ts";
import {DownloadOutlined} from "@ant-design/icons-vue";
import ExportFormModal from "../modals/ExportFormModal.vue";
import Filter from "../../model/nsd/Filter.ts";
import {devMode, connector} from "../../main.ts";
import CatalogType from "../../model/nsd/CatalogType.ts";

interface Props {
  pageSize: number
  sorter: Sorter
  filtration: Filter
  total: number
  exportFileLimit: number
  catalogType : CatalogType
}

const props = defineProps<Props>()
const exportFileLimit = ref<number>(devMode ? 1000 : props.exportFileLimit)
const loading = ref<boolean>(false)
const lastExportedPage = ref<number>(0)
const modal = ref()

function zeroLastExportedPage() {
  lastExportedPage.value = 0
}

defineExpose({zeroLastExportedPage})

async function download(filename: string, blob: Blob) {
  const link = document.createElement('a')
  const downloadUrl = window.URL.createObjectURL(blob)
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

async function downloadExport(offset: number, limit: number) {
  loading.value = true
  try {
    const responseBlob = await connector.getExportFile(props.catalogType.value, props.filtration, props.sorter, offset, limit)
    await download("export.xlsx", responseBlob)
  } catch (error) {
    console.error('Download failed:', error)
  } finally {
    loading.value = false
  }
}

function handleClick() {
  if (props.total > exportFileLimit.value) modal.value.showModal()
  else downloadExport(0, props.total)
}

function handleModalSubmit(startPage: number, endPage: number) {
  const offset = (startPage - 1) * props.pageSize
  const limit = (endPage - startPage + 1) * props.pageSize
  lastExportedPage.value = endPage
  downloadExport(offset, limit)
}

</script>

<template>
  <div class="op-button">
    <ExportFormModal ref="modal"
                     :exportFileLimit="exportFileLimit"
                     :lastExportedPage="lastExportedPage"
                     :total="total"
                     :pageSize="pageSize"
                     @update:submit="handleModalSubmit"/>
    <a-button class="op-button"
              :loading="loading"
              @click="handleClick"
              type="primary">
      <template #icon>
        <DownloadOutlined/>
      </template>
      Экспорт списка
    </a-button>
  </div>
</template>

<style scoped>

</style>
