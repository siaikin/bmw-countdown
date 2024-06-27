<script setup lang="ts">
// See vite.config.ts for details about automatic imports
import IndexPage from '@/pages/IndexPage.vue'

// const VERSION = import.meta.env.VITE_APP_VERSION
// const BUILD_DATE = import.meta.env.VITE_APP_BUILD_EPOCH
//   ? new Date(Number(import.meta.env.VITE_APP_BUILD_EPOCH))
//   : undefined
// const thisYear = new Date().getFullYear()

const HYHuangKeBangShuWFontFace = new FontFace(
  'HYHuangKeBangShuW',
  "url('/HYHuangKeBangShuW.woff2')"
)
document.fonts.add(HYHuangKeBangShuWFontFace)
HYHuangKeBangShuWFontFace.load()
</script>
<template>
  <IndexPage />
</template>
<style>
body {
  font-family:
    HYHuangKeBangShuW,
    STKaiti,
    Kaiti SC,
    Kaiti,
    BlinkMacSystemFont,
    Helvetica Neue,
    PingFang SC,
    Microsoft YaHei,
    Source Han Sans SC,
    Noto Sans CJK SC,
    WenQuanYi Micro Hei,
    Arial,
    sans-serif;
  //background-image: url('https://heishenhua.com/img/b1/img_bg.png');
}
</style>
