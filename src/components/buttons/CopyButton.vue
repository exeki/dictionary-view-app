<script setup lang="ts">
import {h, ref} from "vue";
import {CopyOutlined} from '@ant-design/icons-vue';

interface Props {
  text: string
}

const props = defineProps<Props>()
const tooltipTitle = ref<string>("Скопировать")

function copy() {
  navigator.clipboard.writeText(props.text)
  tooltipTitle.value = 'Скопировано!';
  setTimeout(() => {
    tooltipTitle.value = 'Скопировать'
  }, 2000)
}

</script>

<template>
  <a-tooltip :title="tooltipTitle">
    <a-button type="text"
              class="btn1"
              shape="circle"
              @click="copy"
              :icon="h(CopyOutlined)"/>
  </a-tooltip>
</template>

<style scoped>

</style>
