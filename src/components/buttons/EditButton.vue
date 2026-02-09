<script setup lang="ts">

import {h, ref} from "vue";
import {notification} from "ant-design-vue";
import {connector} from "../../main.ts";
import ElementDto from "../../model/nsd/ElementDto.ts";
import {EditOutlined} from "@ant-design/icons-vue";
import ElementSelect from "../common/ElementSelect.vue";
import CatalogType from "../../model/nsd/CatalogType.ts";
import SelectOption from "../../model/nsd/SelectOption.ts";

interface Props {
  element: ElementDto,
  catalogType: CatalogType
}

interface Emits {
  (e: 'update:edited'): void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const removed = ref<boolean>(props.element.removed)
const title = ref<string>(props.element.title)
const parent = ref<string | null>(null)
const color = ref<string | null>(props.element.color)
const select = ref()
const initParentValue = ref<SelectOption | null>(null)

const showModal = ref<boolean>(false)
const catchE = (e: Error) => {
  notification.error({
    message: "Ошибка при редактировании",
    description: e.message,
    duration: 5
  });
}

async function initFormValues() {
  return connector.get(props.element.uuid).then((el: ElementDto) => {
    title.value = el.title
    removed.value = el.removed
    if (el.parent) {
      initParentValue.value = {value: el.parent.uuid, label: el.title}
      parent.value = el.parent.uuid
    }
    color.value = el.color
  })
}

function yes() {
  connector.edit(
      props.element.uuid,
      title.value,
      removed.value,
      parent.value,
      color.value
  ).then(() => {
    notification.success({
      message: "Отредактировано",
      duration: 2
    })
    emits("update:edited")
  }).catch(catchE).finally(() => showModal.value = false)
}

async function openModal() {
  initFormValues().then(() => {
    showModal.value = true
  })
}
</script>

<template>
  <a-modal v-model:open="showModal"
           title="Редактирование"
           width="400px"
           :footer="null"
           :closable="false"
           :centered="true"
           :maskClosable="true">
    <a-form class="form">
      <a-form-item label="Наименование" :rules="[{ required: true, message: 'Надо' }]">
        <a-input v-model:value="title"></a-input>
      </a-form-item>
      <a-form-item label="В архиве">
        <a-switch v-model:checked="removed"></a-switch>
      </a-form-item>
      <a-form-item label="Родитель" v-if="!catalogType.isFlat || catalogType.isWithFolders">
        <ElementSelect ref="select"
                       :folder="element.folder"
                       :initValue="initParentValue"
                       :catalogType="catalogType"
                       @update:change="selected => parent = selected"/>
      </a-form-item>
      <a-form-item label="Цвет">
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
  <a-button type="text"
            class="btn1"
            shape="circle"
            @click="openModal"
            :icon="h(EditOutlined)"/>
</template>

<style scoped>
.form {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
