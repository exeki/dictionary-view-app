<script setup lang="ts">
import {connector} from "../../main.ts";
import {h, ref} from "vue";
import {notification} from "ant-design-vue";
import ElementDto from "../../model/nsd/ElementDto.ts";
import {DeleteOutlined} from "@ant-design/icons-vue";

interface Props {
  element: ElementDto
}

interface Emits {
  (e: 'update:deleted'): void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()
const showConfirm = ref<boolean>(false)
const catchE = (e: Error) => {
  notification.error({
    message: "Ошибка при удалении",
    description: e.message,
    placement: 'top',
    duration: 5
  });
}

function yes() {
  connector.delete(props.element.uuid).then(() => {
    notification.success({
      message: "Удалено",
      duration: 2
    })
    emits("update:deleted")
  }).catch(catchE).finally(() => showConfirm.value = false)
}
</script>

<template>
  <a-modal v-model:open="showConfirm"
           title="Удаление"
           width="400px"
           :footer="null"
           :closable="false"
           :centered="true"
           :maskClosable="true">
    <div class="text">
      Вы уверены? Вместе с элементом будут удалены все вложенные элементы. Восстановить не получится.
    </div>
    <div>
      <a-button type="primary"
                @click="yes"
                style="margin-right: 8px;">Да
      </a-button>
      <a-button @click="showConfirm = false">Нет</a-button>
    </div>
  </a-modal>
  <a-button type="text"
            class="btn1"
            shape="circle"
            @click="showConfirm = true"
            :icon="h(DeleteOutlined)"/>
</template>

<style scoped>
.text {
  margin-bottom: 20px;
}
</style>
