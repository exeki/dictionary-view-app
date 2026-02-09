<script setup lang="ts">

interface Props {
  color: string | null
}

const props = defineProps<Props>()

</script>

<template>
  <a-badge v-if="color" :color="'#' + props.color" :text="'#' + props.color"/>
</template>

<style scoped>

</style>
