<script setup lang="ts">
import { intervalToDuration, weeksToDays, yearsToDays } from 'date-fns'
import { computed } from 'vue'
import { messages } from '@/intl'

// August 20, 2024 02:00:00 UTC
const HAPPY_DAY = new Date('August 20, 2024 02:00:00 UTC')

const timestamp = ref(Date.now())
setInterval(() => (timestamp.value = Date.now()), 1000)
const duration = computed(() => {
  const result = intervalToDuration({
    start: timestamp.value,
    end: HAPPY_DAY,
  })
  result.days += result.years ? yearsToDays(result.years) : 0
  result.years = 0
  result.days += result.months ? result.months * 30 : 0
  result.months = 0
  result.days += result.weeks ? weeksToDays(result.weeks) : 0
  result.weeks = 0
  return result
})

const matchMediaList = window.matchMedia('(min-width: 1024px)')
const isLargeScreen = ref(matchMediaList.matches)
matchMediaList.addEventListener('change', (event) => {
  isLargeScreen.value = event.matches
  console.log(event.matches)
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
  "url('/HYHuangKeBangShuW.woff2')"
)
document.fonts.add(HYHuangKeBangShuWFontFace)
HYHuangKeBangShuWFontFace.load()
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
        <!--        <div class="text-[#a83d32]" style="font-family: STKaiti">-->
        <!--          {{ localeMessages['releaseSubtitle'] }}-->
        <!--        </div>-->
      </div>
    </main>
    <footer>
      <div class="fixed right-4 bottom-12 flex gap-4 lg:right-auto lg:left-4">
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

.lang-change > .follow-items-view {
  display: none;
}

.lang-change:hover > .follow-items-view {
  display: block;
}
</style>
