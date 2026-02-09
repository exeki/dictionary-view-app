<script setup lang="ts">
import CatalogType from "../../model/nsd/CatalogType.ts";
import {connector} from "../../main.ts";
import {onMounted, ref, watch} from "vue";
import SelectOptionsPage from "../../model/nsd/SelectOptionsPage.ts";
import {debounce} from 'lodash';
import SelectOption from "../../model/nsd/SelectOption.ts";

interface Props {
  catalogType: CatalogType,
  initValue: SelectOption | null,
  folder: boolean
}

interface Emits {
  (e: 'update:change', selected: string | null): void
}


const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const page = ref<number>(1)
const pageSize = ref<number>(50)
const options = ref<SelectOption[]>([])
const selected = ref<string | null>(null)
const searchValue = ref<string | null>(null)

async function getPage(search: string | null = null) {
  connector.getFilterOptionsPage(props.catalogType.value, page.value, pageSize.value, props.folder, search).then((data: SelectOptionsPage) => {
    options.value.push(...data.options.filter((it) => it.value != props.initValue?.value))
    if (props.initValue && page.value == 1) options.value.push(props.initValue)
  })
}

const search = debounce((search: string | null) => {
  page.value = 1
  searchValue.value = search
  options.value.length = 0
  getPage(search)
}, 1000)

onMounted(() => {
  getPage()
  if(props.initValue) selected.value = props.initValue.value
})

watch(() => props.folder, () => {
  selected.value = null
  page.value = 1
  options.value.length = 0
  getPage()
})

</script>

<template>
  <a-select class="select"
            v-model:value="selected"
            @change="emit('update:change', selected)"
            @search="search"
            show-search
            :filterOption="() => true"
            :options="options"/>
</template>

<style scoped>
.select {
  width: 100%;
}
</style>
