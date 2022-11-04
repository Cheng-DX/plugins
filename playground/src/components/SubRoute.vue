<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  route: RouteRecordRaw
}>()
</script>

<template>
  <template v-if="props.route.children">
    <template v-for="route in props.route.children" :key="route.path">
      <sub-route :route="route" />
    </template>
  </template>
  <h2 v-else>
     <RouterLink :to="props.route.path" >{{ props.route.path }}</RouterLink>
  </h2>
</template>
