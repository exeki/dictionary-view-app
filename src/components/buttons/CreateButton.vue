<script setup lang="ts">

import {h, ref} from "vue";
import {notification} from "ant-design-vue";
import {connector} from "../../main.ts";
import {PlusOutlined} from "@ant-design/icons-vue";
import ElementSelect from "../common/ElementSelect.vue";
import CatalogType from "../../model/nsd/CatalogType.ts";

interface Props {
  catalogType: CatalogType
}

interface Emits {
  (e: 'update:added'): void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const folder = ref<boolean>(false)
const title = ref<string>("")
const parent = ref<string | null>(null)
const color = ref<string | null>(null)
const code = ref<string>("")


const showModal = ref<boolean>(false)
const catchE = (e: Error) => {
  notification.error({
    message: "Ошибка при добавлении",
    description: e.message,
    duration: 5
  });
}

function initValues() {
  folder.value = false
  title.value = ""
  parent.value = null
  color.value = null
  code.value = ""
}

function yes() {
  connector.create(
      props.catalogType.value,
      title.value,
      code.value,
      folder.value,
      parent.value,
      color.value
  ).then(() => {
    notification.success({
      message: "Добавлено",
      duration: 2
    })
    emits("update:added")
  }).catch(catchE).finally(() => showModal.value = false)
}

function onFolderChange() {
  if (folder.value) {
    parent.value = null
    color.value = null
  }
}

function openModal() {
  initValues()
  showModal.value = true
}
</script>

<template>
  <a-modal v-model:open="showModal"
           title="Добавление"
           width="400px"
           :footer="null"
           :closable="false"
           :centered="true"
           :maskClosable="true">
    <a-form class="form">
      <a-form-item label="Код" :rules="[{ required: true, message: 'Надо' }]">
        <a-input v-model:value="code"/>
      </a-form-item>
      <a-form-item label="Наименование" :rules="[{ required: true, message: 'Надо' }]">
        <a-input v-model:value="title"/>
      </a-form-item>
      <a-form-item v-if="catalogType.isWithFolders" label="Папка">
        <a-switch v-model:checked="folder" @change="onFolderChange"/>
      </a-form-item>
      <a-form-item v-if="!catalogType.isFlat || catalogType.isWithFolders" label="Родитель">
        <ElementSelect :catalogType="catalogType" :initValue="null" :folder="folder"
                       @update:change="selected => parent = selected"/>
      </a-form-item>
      <a-form-item v-if="!folder" label="Цвет">
        <a-input v-model:value="color"/>
      </a-form-item>
    </a-form>
    <div>
      <a-button type="primary"
                @click="yes"
                style="margin-right: 8px;">Да
      </a-button>
      <a-button @click="showModal = false">Нет</a-button>
    </div>
  </a-modal>
  <a-button class="filter--button op-button"
            type="primary"
            @click="openModal"
            :icon="h(PlusOutlined)">
    Добавить
  </a-button>
</template>

<style scoped>
.form {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
