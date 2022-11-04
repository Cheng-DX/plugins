<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { routes } from 'virtual:file-router'
import Root from './views/index.vue'
import SubRoute from './components/SubRoute.vue'
</script>

<template>
  <SubRoute v-for="route in routes" :key="route.path" :route="route" />
  <div class="main">
    <Root />
  </div>
</template>

<style scoped>
.main {
  height: 800px;
  width: 800px;
  background-color: rgb(13, 119, 135);
  color: aliceblue;
}
</style>
