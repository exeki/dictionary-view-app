<script setup lang="ts">
import {baseUrl, connector} from "./main.ts";
import {onMounted, ref} from "vue";
import type InitialData from "./model/nsd/InitialData.ts";
import localization from "./localization.ts";
import FlatTable from "./components/Table.vue";
import CatalogType from "./model/nsd/CatalogType.ts";
import {notification} from "ant-design-vue";
import SelectOption from "./model/nsd/SelectOption.ts";
import CopyButton from "./components/buttons/CopyButton.vue";

const catalogType = ref<CatalogType | null | undefined>(null)
const metaCode = ref<string | null>('RFCcategories')
const tableMode = ref<'flat' | 'hierarchy'>('flat')
const initData = ref<InitialData | null>(null)

function onMetaCodeSelect() {
  catalogType.value = initData.value!.types.find((cat) => cat.value == metaCode.value)
}

onMounted(() => {
  connector.getInitialInfo().then(data => {
    initData.value = data
    onMetaCodeSelect()
  }).catch((e) => {
    notification.error({
      message: 'Ошибка при инициализации',
      description: e.message,
      duration: 5
    })
  })
})

const search = (value: string, option: SelectOption) => option.label.toLowerCase().includes(value.toLowerCase())
</script>

<template>
  <a-config-provider :locale="localization">
    <a-space v-if="initData" class="type-select-panel" direction="vertical">
      <a-space class="select-line" direction="horizontal">
        <div class="label">Справочник:</div>
        <a-select class="value meta-code-select"
                  show-search
                  :filterOption="search"
                  :autoClearSearchValue="true"
                  v-model:value="metaCode"
                  :options="initData.types"
                  @change="onMetaCodeSelect">
        </a-select>
      </a-space>
      <a-space class="select-line" direction="horizontal">
        <div class="label">Режим таблицы:</div>
        <a-select class="value meta-code-select"
                  show-search
                  :filterOption="search"
                  :options="[{label : 'Плоский список', value : 'flat'}, {label : 'Иерархия', value : 'hierarchy'}]"
                  v-model:value="tableMode"/>
      </a-space>
      <a-space v-if="catalogType" class="line" direction="horizontal">
        <div class="label">Код справочника:</div>
        <div class="value copy">
          <a class="simple-value" :href="baseUrl + 'admin/#catalog:' +  catalogType.value" target="_blank">
            {{ catalogType.value }}
          </a>
          <CopyButton :text="catalogType.value"/>
        </div>
      </a-space>
      <a-space v-if="catalogType" class="line" direction="horizontal">
        <div class="label">С папками:</div>
        <div class="value">
          <span class="simple-value">{{ catalogType.isWithFolders ? "Да" : "Нет" }}</span>
        </div>
      </a-space>
      <a-space v-if="catalogType" class="line" direction="horizontal">
        <div class="label">Плоский:</div>
        <div class="value">
          <span class="simple-value">{{ catalogType.isFlat ? "Да" : "Нет" }}</span>
        </div>
      </a-space>
    </a-space>
    <div v-if="initData && catalogType" class="table">
      <FlatTable :initData="initData!" :catalogType="catalogType!" :tableMode="tableMode"/>
    </div>
  </a-config-provider>
</template>


<style scoped>
.table {
  min-height: 400px;
}

.value {
  min-width: 292px;
}

.simple-value {
  padding-left: 7px;
}

.type-select-panel {
  margin: 5px 5px 0 5px;
}

.label {
  width: 120px;
  margin-left: 5px;
}

.line {
  border-bottom: solid 1px #d3d3d3;
  height: 32px;
}

.select-line {
  border: solid 1px #d3d3d3;
  border-radius: 7px;
  height: 32px;
}

.meta-code-select {
  border-radius: 0 0 0 0;
}

.copy {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
