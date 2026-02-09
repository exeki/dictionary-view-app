<script setup lang="ts">
import {defineProps} from 'vue'
import {baseUrl} from "../../main.ts";

defineProps({
  title: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: false
  }
})

</script>

<template>
  <a v-if="title && uuid" :href="baseUrl + '/admin/#ci:' + uuid" target="_blank">{{ title }}</a>
</template>

<style scoped>
a {
  background: transparent;
}
</style>
