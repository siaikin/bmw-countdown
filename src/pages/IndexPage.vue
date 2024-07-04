<script setup lang="ts">
import { differenceInSeconds } from 'date-fns'
import { messages } from '@/intl'
import { ref, computed, watch } from 'vue'
import { useHead } from '@unhead/vue'
// import CookieBgPC from '../assets/images/cookies-bg-pc.png'
// import CookieBg from '../assets/images/cookies-bg.png'
// import { genImage } from './gen-image'

// August 20, 2024 02:00:00 UTC
const HAPPY_DAY = new Date('August 20, 2024 02:00:00 UTC')

const timestamp = ref(Date.now())
setInterval(() => {
  timestamp.value = Date.now()
}, 1000)
const duration = computed(() => {
  const result = { days: 0, hours: 0, minutes: 0, seconds: 0 }

  let seconds = differenceInSeconds(HAPPY_DAY, timestamp.value)
  result.days = Math.floor(seconds / 86400)
  seconds -= result.days * 86400
  result.hours = Math.floor(seconds / 3600)
  seconds -= result.hours * 3600
  result.minutes = Math.floor(seconds / 60)
  seconds -= result.minutes * 60
  result.seconds = seconds

  return result
})

const matchMediaList = window.matchMedia('(min-width: 1024px)')
const isLargeScreen = ref(matchMediaList.matches)
matchMediaList.addEventListener('change', (event) => {
  isLargeScreen.value = event.matches
})

const languageList = ref([
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
])
const currentLanguage = ref(
  languageList.value.find((lang) => lang.value === localStorage.language) ??
    languageList.value[navigator.languages[0] === 'zh-CN' ? 0 : 2]
)
watch(
  currentLanguage,
  () => (localStorage.language = currentLanguage.value.value)
)

const localeMessages = computed(() => messages[currentLanguage.value.value])

useHead({
  title: () => localeMessages.value['title'],
  meta: [
    {
      property: 'og:title',
      content: () => localeMessages.value['title'],
    },
    {
      name: 'twitter:title',
      content: () => localeMessages.value['title'],
    },
  ],
})

const HYHuangKeBangShuWFontFace = new FontFace(
  'HYHuangKeBangShuW',
  "url('./HYHuangKeBangShuW.woff2')"
)
document.fonts.add(HYHuangKeBangShuWFontFace)
HYHuangKeBangShuWFontFace.load()

// const stats = ref({ visitors: 0, pageViews: 0 })
// onMounted(async () => {
//   const url = new URL(
//     '/umami-api/websites/1f07fe02-2d8d-44e2-b096-6d98dcc9fd40/stats',
//     location.origin
//   )
//   url.searchParams.set('startAt', 0)
//   url.searchParams.set('endAt', Date.now().toString())
//   const resp = await fetch(url, {
//     method: 'GET',
//   })
//   const { visitors, pageviews } = await resp.json()
//   stats.value = {
//     visitors: visitors?.value ?? 0,
//     pageViews: pageviews?.value ?? 0,
//   }
// })

// import { registerSW } from 'virtual:pwa-register'
// const hasUpdate = ref(false)
// const updateSW = registerSW({
//   onNeedRefresh() {
//     hasUpdate.value = true
//   },
//   onOfflineReady() {},
// })
// function handleRefresh() {
//   updateSW()
// }
// const beforeInstallPromptEvent = ref()
// window.addEventListener(
//   'beforeinstallprompt',
//   (event) => (beforeInstallPromptEvent.value = event)
// )

// const sharedImageLoading = ref(true)
// const sharedImage = ref()
// onMounted(async () => {
//   sharedImage.value = await genImage([
//     duration.value.days,
//     localeMessages.value['day'],
//     duration.value.hours,
//     localeMessages.value['hour'],
//     duration.value.minutes,
//     localeMessages.value['minute'],
//     duration.value.seconds,
//     localeMessages.value['second'],
//   ])
//   sharedImageLoading.value = false
// })

// const generatedImageCopied = ref(false)
// async function generateAndCopyImage() {
//   const image = sharedImage.value
//   try {
//     const data = [new ClipboardItem({ [image.type]: image })]
//     await navigator.clipboard.write(data)
//     generatedImageCopied.value = true
//   } catch (e) {
//     console.error(e)
//
//     // download image
//     const a = document.createElement('a')
//     a.href = URL.createObjectURL(image)
//     a.download = `${localeMessages.value['title']}.png`
//     a.click()
//
//     // revoke object URL
//     URL.revokeObjectURL(a.href)
//   }
// }

// const shareSupported =
//   navigator.share !== undefined && navigator.canShare !== undefined
// async function handleShare() {
//   const image = sharedImage.value
//   try {
//     const shareData = {
//       title: localeMessages.value['title'],
//       url: location.origin,
//       text: `${localeMessages.value['title']} - ${duration.value.days}${localeMessages.value['day']} ${duration.value.hours}${localeMessages.value['hour']} ${duration.value.minutes}${localeMessages.value['minute']} ${duration.value.seconds}${localeMessages.value['second']}`,
//       files: [
//         new File([image], `${localeMessages.value['title']}.png`, {
//           type: 'image/png',
//         }),
//       ],
//     }
//     if (navigator.canShare(shareData)) {
//       await navigator.share(shareData)
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }
</script>
<template>
  <!-- fix safari bug: https://www.reddit.com/r/css/comments/hz0jkf/postcss_plugin_to_fix_mobile_safari_bug_with_100vh/   -->
  <div class="relative h-full overflow-hidden bg-black">
    <header class="fixed top-0 lg:right-[6.25vw] select-none z-30">
      <div
        class="absolute left-4 lg:right-0 top-[2vw] flex flex-col lg:items-end items-start"
      >
        <div class="lg:w-[6vw] w-[24vw] cursor-pointer"></div>
        <div class="lg:w-[2vw] w-[6vw] pt-6 pr-1">
          <img
            src="/img_logo_bm.png"
            width="68"
            height="186"
            alt="heishenhua logo"
          />
        </div>
      </div>
    </header>
    <main class="lg:w-full h-full">
      <video
        v-if="isLargeScreen"
        class="w-full h-full object-cover"
        poster="/shared-image/bg.png"
        loop
        preload="auto"
        muted
        playsinline
        autoplay
        width="1920"
        height="1080"
        webkit-playsinline
        x-webkit-airplay
        x5-video-player-type
        x5-video-orientation
        x5-video-player-fullscreen
        x5-video-ignore-metadata
      >
        <source src="/video_WebTitle_batch.webm" type="video/mp4" />
        Your browser does not support playback for this video. Please update
        your browser or try a different one.
      </video>
      <video
        v-else
        class="w-full h-full object-cover"
        poster="/shared-image/bg.png"
        loop
        preload="auto"
        muted
        playsinline
        autoplay
        width="480"
        height="640"
        webkit-playsinline
        x-webkit-airplay
        x5-video-player-type
        x5-video-orientation
        x5-video-player-fullscreen
        x5-video-ignore-metadata
      >
        <source src="/video_WebTitle_batch_Mobile.webm" type="video/mp4" />
        Your browser does not support playback for this video. Please update
        your browser or try a different one.
      </video>
      <div
        class="absolute text-center lg:left-auto lg:w-auto lg:top-[8vw] lg:right-[12vw] top-[12vh] left-0 w-full h-full flex flex-col items-center"
      >
        <div class="lg:w-[40vw] lg:h-[24vw] w-[80vw] h-[48vw]">
          <img
            src="/shared-image/logo.png"
            width="1154"
            height="682"
            alt="Big logo"
          />
        </div>
        <div
          class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] gap-4 flex justify-between custom-font text-nowrap"
        >
          <span class="mr-1">
            {{ duration.days ?? 0
            }}<span class="text-[0.4em]">{{ localeMessages['day'] }}</span>
          </span>
          <span class="mr-1">
            {{ duration.hours ?? 0
            }}<span class="text-[0.4em]">{{ localeMessages['hour'] }}</span>
          </span>
          <span class="mr-1">
            {{ duration.minutes ?? 0
            }}<span class="text-[0.4em]">{{ localeMessages['minute'] }}</span>
          </span>
          <span class="mr-1">
            {{ duration.seconds ?? 0
            }}<span class="text-[0.4em]">{{ localeMessages['second'] }}</span>
          </span>
        </div>
      </div>
    </main>
  </div>
</template>
<style>
.custom-font {
  background-image: linear-gradient(#e8cfac, #a58a66, #c1a583);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
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
}

.stats-font {
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
}

.lang-change > .follow-items-view {
  display: none;
}

.lang-change:hover > .follow-items-view {
  display: block;
}
</style>
