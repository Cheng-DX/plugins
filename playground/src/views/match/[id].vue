<script setup lang="ts">
import { useRoute } from 'vue-router'

const { params: { id } } = useRoute()
</script>

<template>
  <h1>
    {{ id }}
  </h1>
</template>

<style scoped>

</style>
