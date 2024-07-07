<script setup lang="ts">
import { differenceInSeconds } from 'date-fns'
import { messages } from '@/intl'
import { ref, computed, watch, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import CookieBgPC from '../assets/images/cookies-bg-pc.png'
import CookieBg from '../assets/images/cookies-bg.png'
import { genImage } from './gen-image'

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
      property: 'og:description',
      content: () =>
        `${localeMessages.value['title']} - ${duration.value.days}${localeMessages.value['day']} ${duration.value.hours}${localeMessages.value['hour']} ${duration.value.minutes}${localeMessages.value['minute']} ${duration.value.seconds}${localeMessages.value['second']}`,
    },
    {
      property: 'og:locale',
      content: currentLanguage.value.value,
    },
    {
      property: 'og:site_name',
      content: localeMessages.value['title'],
    },
  ],
})

const HYHuangKeBangShuWFontFace = new FontFace(
  'HYHuangKeBangShuW',
  "url('/HYHuangKeBangShuW.woff2')"
)
document.fonts.add(HYHuangKeBangShuWFontFace)
HYHuangKeBangShuWFontFace.load()

const stats = ref({ visitors: 0, pageViews: 0 })
onMounted(async () => {
  const url = new URL(
    '/umami-api/websites/1f07fe02-2d8d-44e2-b096-6d98dcc9fd40/stats',
    location.origin
  )
  url.searchParams.set('startAt', 0)
  url.searchParams.set('endAt', Date.now().toString())
  const resp = await fetch(url, {
    method: 'GET',
  })
  const { visitors, pageviews } = await resp.json()
  stats.value = {
    visitors: visitors?.value ?? 0,
    pageViews: pageviews?.value ?? 0,
  }
})

import { registerSW } from 'virtual:pwa-register'
import Countdown from '@/components/Countdown.vue'
const hasUpdate = ref(false)
const updateSW = registerSW({
  onNeedRefresh() {
    hasUpdate.value = true
  },
  onOfflineReady() {},
})
function handleRefresh() {
  updateSW()
}
const beforeInstallPromptEvent = ref()
window.addEventListener(
  'beforeinstallprompt',
  (event) => (beforeInstallPromptEvent.value = event)
)

const sharedImageLoading = ref(true)
const sharedImage = ref()
onMounted(async () => {
  sharedImage.value = await genImage([
    duration.value.days,
    localeMessages.value['day'],
    duration.value.hours,
    localeMessages.value['hour'],
    duration.value.minutes,
    localeMessages.value['minute'],
    duration.value.seconds,
    localeMessages.value['second'],
  ])
  sharedImageLoading.value = false
})

const generatedImageCopied = ref(false)
async function generateAndCopyImage() {
  const image = sharedImage.value
  try {
    const data = [new ClipboardItem({ [image.type]: image })]
    await navigator.clipboard.write(data)
    generatedImageCopied.value = true
  } catch (e) {
    console.error(e)

    // download image
    const a = document.createElement('a')
    a.href = URL.createObjectURL(image)
    a.download = `${localeMessages.value['title']}.png`
    a.click()

    // revoke object URL
    URL.revokeObjectURL(a.href)
  }
}

const shareSupported =
  navigator.share !== undefined && navigator.canShare !== undefined
async function handleShare() {
  const image = sharedImage.value
  try {
    const shareData = {
      title: localeMessages.value['title'],
      url: location.origin,
      text: `${localeMessages.value['title']} - ${duration.value.days}${localeMessages.value['day']} ${duration.value.hours}${localeMessages.value['hour']} ${duration.value.minutes}${localeMessages.value['minute']} ${duration.value.seconds}${localeMessages.value['second']}`,
      files: [
        new File([image], `${localeMessages.value['title']}.png`, {
          type: 'image/png',
        }),
      ],
    }
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData)
    }
  } catch (e) {
    console.log(e)
  }
}
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
            src="https://heishenhua.com/img/b1/img_logo_bm.png"
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
        poster="https://www.heishenhua.com/img/MobileWeb/img_MbWeb_bg_title.png"
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
        <source src="/video_WebTitle_batch.mp4" type="video/mp4" />
        Your browser does not support playback for this video. Please update
        your browser or try a different one.
      </video>
      <video
        v-else
        class="w-full h-full object-cover"
        poster="https://www.heishenhua.com/img/MobileWeb/img_MbWeb_bg_title.png"
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
        <source src="/video_WebTitle_batch_Mobile.mp4" type="video/mp4" />
        Your browser does not support playback for this video. Please update
        your browser or try a different one.
      </video>
      <div
        class="absolute text-center lg:left-auto lg:w-auto lg:top-[8vw] lg:right-[12vw] top-[12vh] left-0 w-full h-full flex flex-col items-center"
      >
        <div class="lg:w-[40vw] lg:h-[24vw] w-[80vw] h-[48vw]">
          <img
            src="https://www.heishenhua.com/img/home/main/phone-home-login.png"
            width="1154"
            height="682"
            alt="Big logo"
          />
        </div>
        <span
          v-if="differenceInSeconds(HAPPY_DAY, timestamp) <= 0"
          class="custom-font text-[#a83d32] text-7xl mb-4"
        >
          已发售
        </span>
        <Countdown
          :locale-messages="localeMessages"
          :duration="Math.abs(differenceInSeconds(HAPPY_DAY, timestamp))"
        />
      </div>
    </main>
    <footer>
      <div
        class="fixed right-4 bottom-12 flex flex-col lg:flex-row items-end gap-2 lg:gap-4 lg:right-auto lg:left-4 text-[#b5b4b2] text-base"
      >
        <div class="flex flex-col items-end lg:items-start gap-4">
          <div>
            <button
              v-if="beforeInstallPromptEvent"
              class="bg-[url('/src/assets/images/cookies-btn.png')] bg-[length:100%_100%] px-2 py-1"
              @click="beforeInstallPromptEvent.prompt()"
            >
              {{ localeMessages['installToDesktop'] }}
            </button>
          </div>
          <div class="flex gap-4">
            <button
              class="bg-[url('/src/assets/images/cookies-btn.png')] bg-[length:100%_100%] px-2 py-1 text-sm"
              :disabled="sharedImageLoading"
              @click="generateAndCopyImage"
            >
              <template v-if="generatedImageCopied">
                {{ localeMessages['copied'] }}
              </template>
              <template v-else>
                {{ localeMessages['generateShareImage'] }}
                {{ sharedImageLoading ? localeMessages['loading'] : '' }}
              </template>
            </button>
            <button
              v-if="shareSupported"
              class="bg-[url('/src/assets/images/cookies-btn.png')] bg-[length:100%_100%] px-2 py-1 text-sm"
              :disabled="sharedImageLoading"
              @click="handleShare"
            >
              {{ localeMessages['share'] }}
              {{ sharedImageLoading ? localeMessages['loading'] : '' }}
            </button>
          </div>
          <div class="flex gap-4">
            <span class="-mr-2">{{ localeMessages['forum'] }} </span>
            <a
              href="https://discord.com/invite/blackmythwukong"
              target="_blank"
              title="Discord invite"
            >
              <img
                src="/discord-logo.svg"
                alt="Discord logo"
                class="h-6 aspect-square"
              />
            </a>
            <a
              href="https://tieba.baidu.com/f?kw=%E9%BB%91%E7%A5%9E%E8%AF%9D&ie=utf-8"
              target="_blank"
              title="百度贴吧 - 黑神话"
            >
              <img
                src="/baidu-tieba-logo.svg"
                alt="百度贴吧 logo"
                class="h-6 aspect-square"
              />
            </a>
          </div>
        </div>
        <div
          v-if="stats.visitors > 0 && stats.pageViews > 0"
          class="stats-font lg:items-center"
          v-html="localeMessages['statsText'](stats)"
        ></div>
      </div>
      <div class="fixed right-4 w-16 top-12 lg:top-auto lg:bottom-12">
        <div class="w-full lang-change">
          <img
            src="https://heishenhua.com/img/home/main/language-icon.png"
            class="w-6 absolute cursor-pointer left-[50%] translate-x-[-50%]"
            alt="language"
          />
          <div
            class="follow-items-view absolute top-0 lg:top-auto lg:bottom-0 pt-8 lg:pb-4 w-full text-center left-[50%] translate-x-[-50%]"
          >
            <template v-for="locale in languageList" :key="locale.value">
              <div
                class="relative cursor-pointer w-full overflow-hidden text-xs leading-5 text-[#a5a5a5] hover:text-white hover:text-sm"
                @click="currentLanguage = locale"
              >
                {{ locale.label }}
              </div>
            </template>
          </div>
        </div>
        <!---->
      </div>
    </footer>
  </div>
  <div
    v-if="hasUpdate"
    class="fixed bottom-4 lg:bottom-1 w-full flex flex-col items-center text-[4vw] lg:text-sm text-[#431717]"
  >
    <div class="relative w-[95%] lg:w-[48%]">
      <img
        :src="isLargeScreen ? CookieBgPC : CookieBg"
        width="1037"
        height="326"
        alt="cookies bg"
      />
      <div
        class="absolute top-0 left-0 z-10 w-full h-full flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-4 px-4"
      >
        <p>{{ localeMessages['newVersionTips'] }}</p>
        <div
          class="relative flex flex-col justify-center items-center w-[32vw] lg:w-[8vw] h-[8vw] lg:h-[2vw] cursor-pointer"
          @click="handleRefresh"
        >
          <img
            class="absolute left-0 top-0 -z-10 opacity-40 w-full"
            src="/src/assets/images/cookies-btn.png"
            width="180"
            height="45"
            alt="button bg"
          />
          <div class="text-[4vw] lg:text-[1vw]">{{ localeMessages['ok'] }}</div>
        </div>
      </div>
    </div>
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
