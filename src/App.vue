<script setup lang="ts">
// See vite.config.ts for details about automatic imports
import IndexPage from '@/pages/IndexPage.vue'

// const VERSION = import.meta.env.VITE_APP_VERSION
// const BUILD_DATE = import.meta.env.VITE_APP_BUILD_EPOCH
//   ? new Date(Number(import.meta.env.VITE_APP_BUILD_EPOCH))
//   : undefined
// const thisYear = new Date().getFullYear()
</script>
<template>
  <IndexPage />
</template>
<style>
html,
body,
#app {
  height: 100%;
}

body {
  background-image: url('https://heishenhua.com/img/b1/img_bg.png');
  background-repeat: repeat;
}
</style>
