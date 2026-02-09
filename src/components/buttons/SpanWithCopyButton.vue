<script setup lang="ts">
import CopyButton from "./CopyButton.vue";

interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="cont">
    <CopyButton :text="text"/>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.cont {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
