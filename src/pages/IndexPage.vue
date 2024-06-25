<script setup lang="ts">
import { intervalToDuration, weeksToDays, yearsToDays } from 'date-fns'
import { computed } from 'vue'
import { messages } from '../../intl'

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
  { label: '繁體中⽂', value: 'zh-TW' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Español', value: 'es' },
])
const currentLanguage = ref(
  languageList.value[navigator.languages[0] === 'zh-CN' ? 0 : 2]
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
</script>
<template>
  <div class="relative h-[100vh] overflow-hidden bg-black">
    <header class="fixed top-0 lg:right-[6.25vw] h-100vh select-none z-30">
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
        class="w-full object-cover max-w-[unset]"
        poster="https://www.heishenhua.com/img/MobileWeb/img_MbWeb_bg_title.png"
        loop
        preload="auto"
        muted
        playsinline
        autoplay
        webkit-playsinline
        x-webkit-airplay
        x5-video-player-type
        x5-video-orientation
        x5-video-player-fullscreen
        x5-video-ignore-metadata
      >
        <source
          src="https://heishenhua.com/video/b1/video_WebTitle_batch.mp4"
          type="video/mp4"
        />
        Your browser does not support playback for this video. Please update
        your browser or try a different one.
      </video>
      <img
        v-else
        src="https://www.heishenhua.com/img/MobileWeb/img_MbWeb_bg_title.png"
        width="1080"
        height="1920"
        alt=""
        class="w-full object-cover max-w-[unset]"
      />
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
          class="text-[36px] md:text-[64px] lg:text-[72px] xl:text-[96px] flex justify-between font-bold gap-[4vw] text-nowrap"
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
        <div class="w-full flex justify-center items-center lang-change">
          <img
            src="https://heishenhua.com/img/home/main/language-icon.png"
            class="w-8 absolute cursor-pointer"
            alt="language"
          />
          <div
            class="follow-items-view absolute top-0 lg:top-auto lg:bottom-0 pt-4 lg:pb-4 w-full text-center"
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
.font-bold {
  background-image: linear-gradient(#e8cfac, #a58a66, #c1a583);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
.lang-change > .follow-items-view {
  display: none;
}

.lang-change:hover > .follow-items-view {
  display: block;
}
</style>
