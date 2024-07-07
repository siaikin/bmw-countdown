<script setup lang="ts">
import { type PropType, toRefs, defineProps, watch, ref, computed } from 'vue'
import { interpolateRound } from 'd3-interpolate'
import { range, zip } from 'd3-array'
import { max } from 'd3'

const PREV_HAPPY_DAY = new Date('August 20, 2023 02:00:00 UTC')
const HAPPY_DAY = new Date('August 20, 2024 02:00:00 UTC')

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  localeMessages: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
})

const { duration, localeMessages } = toRefs(props)

const durationFlipData = ref({
  direction: false,
  days: [],
  hours: [],
  minutes: [],
  seconds: [],
})
const transitionControl = ref(false)
const transiting = ref(false)
const old = ref()
const transitionDuration = ref(2000)
watch(
  duration,
  (value) => {
    if (transiting.value) return
    transiting.value = true

    transitionControl.value = false

    let oldValue = old.value
    old.value = value
    if (!oldValue) {
      oldValue = Math.floor(
        (HAPPY_DAY.getTime() - PREV_HAPPY_DAY.getTime()) / 1000
      )
    } else {
      transitionDuration.value = 400
    }

    const durationFlipDataValue = {
      direction: false,
      days: [],
      hours: [],
      minutes: [],
      seconds: [],
    }
    const interpolate = interpolateRound(oldValue, value)

    durationFlipDataValue.direction = oldValue < value

    for (const i in range(60)) {
      const t = i / 59
      const result = { days: 0, hours: 0, minutes: 0, seconds: 0 }

      let totalSeconds = interpolate(t)
      result.days = Math.floor(totalSeconds / 86400)
      totalSeconds -= result.days * 86400
      result.hours = Math.floor(totalSeconds / 3600)
      totalSeconds -= result.hours * 3600
      result.minutes = Math.floor(totalSeconds / 60)
      totalSeconds -= result.minutes * 60
      result.seconds = totalSeconds

      durationFlipDataValue.days.push(result.days)
      durationFlipDataValue.hours.push(result.hours)
      durationFlipDataValue.minutes.push(result.minutes)
      durationFlipDataValue.seconds.push(result.seconds)
    }

    const daysLength = Math.max(
      max(durationFlipDataValue.days).toString().length,
      3
    )

    durationFlipDataValue.days = zip(
      ...durationFlipDataValue.days.map((value) => {
        const result = range(daysLength).map(() => '')
        value
          .toString()
          .split('')
          .reverse()
          .forEach((digit, index) => (result[daysLength - index - 1] = digit))
        return result
      })
    )
    const hoursLength = Math.max(
      max(durationFlipDataValue.hours).toString().length,
      2
    )

    durationFlipDataValue.hours = zip(
      ...durationFlipDataValue.hours.map((value) => {
        const result = range(hoursLength).map(() => '0')
        value
          .toString()
          .split('')
          .reverse()
          .forEach((digit, index) => (result[hoursLength - index - 1] = digit))
        return result
      })
    )
    const minutesLength = Math.max(
      max(durationFlipDataValue.minutes).toString().length,
      2
    )

    durationFlipDataValue.minutes = zip(
      ...durationFlipDataValue.minutes.map((value) => {
        const result = range(minutesLength).map(() => '0')
        value
          .toString()
          .split('')
          .reverse()
          .forEach(
            (digit, index) => (result[minutesLength - index - 1] = digit)
          )
        return result
      })
    )
    const secondsLength = Math.max(
      max(durationFlipDataValue.seconds).toString().length,
      2
    )
    durationFlipDataValue.seconds = zip(
      ...durationFlipDataValue.seconds.map((value) => {
        const result = range(secondsLength).map(() => '0')
        value
          .toString()
          .split('')
          .reverse()
          .forEach(
            (digit, index) => (result[secondsLength - index - 1] = digit)
          )
        return result
      })
    )

    /**
     * 删除连续的重复项
     */
    durationFlipDataValue.days = durationFlipDataValue.days.map((sublist) =>
      sublist.filter(
        (value, index, array) => index === 0 || value !== array[index - 1]
      )
    )
    durationFlipDataValue.hours = durationFlipDataValue.hours.map((sublist) =>
      sublist.filter(
        (value, index, array) => index === 0 || value !== array[index - 1]
      )
    )
    durationFlipDataValue.minutes = durationFlipDataValue.minutes.map(
      (sublist) =>
        sublist.filter(
          (value, index, array) => index === 0 || value !== array[index - 1]
        )
    )
    durationFlipDataValue.seconds = durationFlipDataValue.seconds.map(
      (sublist) =>
        sublist.filter(
          (value, index, array) => index === 0 || value !== array[index - 1]
        )
    )

    durationFlipData.value = durationFlipDataValue

    setTimeout(() => {
      transitionControl.value = true
    }, 500)
  },
  { immediate: true, once: false }
)

const percentage = computed(() => {
  const secondPerYear = HAPPY_DAY.getTime() - PREV_HAPPY_DAY.getTime()
  return Math.floor(
    ((secondPerYear * 3 + new Date().getTime() - PREV_HAPPY_DAY.getTime()) /
      (secondPerYear * 4)) *
      100
  )
})
</script>

<template>
  <div
    class="relative text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] gap-0 lg:gap-4 flex justify-between text-nowrap custom-font"
  >
    <span class="mr-1 overflow-hidden mask-bg countdown-color">
      <span
        v-for="(sublist, index) in durationFlipData.days"
        :key="index"
        class="inline-block relative"
      >
        <span class="inline-block invisible">8</span>
        <span
          class="absolute left-0 inline-flex flex-col w-full"
          :class="{
            'transition-none': !(sublist.length > 1 && transitionControl),
            'transition-transform': sublist.length > 1 && transitionControl,
            'top-0': !durationFlipData.direction,
            'bottom-0': durationFlipData.direction,
            'translate-y-[100%]':
              durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
            'translate-y-[-100%]':
              !durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
          }"
          :style="{ transitionDuration: `${transitionDuration}ms` }"
        >
          <span v-for="(digit, subIndex) in sublist" :key="digit">
            <template
              v-if="subIndex === sublist.length - 1 && sublist.length > 1"
            >
              <span class="absolute left-0"> {{ digit }} </span>
            </template>
            <template v-else>
              {{ digit }}
            </template>
          </span>
        </span>
      </span>
      <span class="text-[0.4em]">{{ localeMessages['day'] }}</span>
    </span>
    <span class="mr-1 overflow-hidden mask-bg countdown-color">
      <span
        v-for="(sublist, index) in durationFlipData.hours"
        :key="index"
        class="inline-block relative"
      >
        <span class="inline-block invisible">8</span>
        <span
          class="absolute left-0 inline-flex flex-col w-full"
          :class="{
            'transition-none': !(sublist.length > 1 && transitionControl),
            'transition-transform': sublist.length > 1 && transitionControl,
            'top-0': !durationFlipData.direction,
            'bottom-0': durationFlipData.direction,
            'translate-y-[100%]':
              durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
            'translate-y-[-100%]':
              !durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
          }"
          :style="{ transitionDuration: `${transitionDuration}ms` }"
        >
          <span v-for="(digit, subIndex) in sublist" :key="subIndex">
            <template
              v-if="subIndex === sublist.length - 1 && sublist.length > 1"
            >
              <span class="absolute left-0"> {{ digit }} </span>
            </template>
            <template v-else>
              {{ digit }}
            </template>
          </span>
        </span>
      </span>
      <span class="text-[0.4em]">{{ localeMessages['hour'] }}</span>
    </span>
    <span class="mr-1 overflow-hidden mask-bg countdown-color">
      <span
        v-for="(sublist, index) in durationFlipData.minutes"
        :key="index"
        class="inline-block relative"
      >
        <span class="inline-block invisible">8</span>
        <span
          class="absolute left-0 inline-flex flex-col w-full"
          :class="{
            'transition-none': !(sublist.length > 1 && transitionControl),
            'transition-transform': sublist.length > 1 && transitionControl,
            'top-0': !durationFlipData.direction,
            'bottom-0': durationFlipData.direction,
            'translate-y-[100%]':
              durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
            'translate-y-[-100%]':
              !durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
          }"
          :style="{ transitionDuration: `${transitionDuration}ms` }"
        >
          <span v-for="(digit, subIndex) in sublist" :key="subIndex">
            <template
              v-if="subIndex === sublist.length - 1 && sublist.length > 1"
            >
              <span class="absolute left-0"> {{ digit }} </span>
            </template>
            <template v-else>
              {{ digit }}
            </template>
          </span>
        </span>
      </span>
      <span class="text-[0.4em]">{{ localeMessages['minute'] }}</span>
    </span>
    <span class="mr-1 overflow-hidden mask-bg countdown-color">
      <span
        v-for="(sublist, index) in durationFlipData.seconds"
        :key="index"
        class="inline-block relative"
      >
        <span class="inline-block invisible">8</span>
        <span
          class="absolute left-0 inline-flex flex-col w-full"
          :class="{
            'transition-none': !(sublist.length > 1 && transitionControl),
            'transition-transform': sublist.length > 1 && transitionControl,
            'top-0': !durationFlipData.direction,
            'bottom-0': durationFlipData.direction,
            'translate-y-[100%]':
              durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
            'translate-y-[-100%]':
              !durationFlipData.direction &&
              (sublist.length > 1 ? transitionControl : false),
          }"
          :style="{ transitionDuration: `${transitionDuration}ms` }"
          @transitionend="transiting = false"
        >
          <span v-for="(digit, subIndex) in sublist" :key="subIndex">
            <template
              v-if="subIndex === sublist.length - 1 && sublist.length > 1"
            >
              <span class="absolute left-0"> {{ digit }} </span>
            </template>
            <template v-else>
              {{ digit }}
            </template>
          </span>
        </span>
      </span>
      <span class="text-[0.4em]">{{ localeMessages['second'] }}</span>
    </span>

    <div class="absolute left-0 mt-1 top-full w-full h-1">
      <div
        class="w-full h-full"
        style="mask-image: url('/progress-bg.svg'); mask-size: cover"
      >
        <div
          class="absolute -z-10 top-0 left-0 bg-[#b5b4b2] opacity-30 w-full h-full"
        ></div>
        <div
          class="bg-[#a58a66] h-full"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>

      <div class="absolute mt-0 w-full text-xs text-center">
        <div class="absolute left-[-12.5%] w-[25%]">
          <span style="color: #b5b4b2">2020</span>
        </div>
        <div class="absolute left-[12.5%] w-[25%]">
          <span style="color: #b5b4b2"> 2021 </span>
        </div>
        <div class="absolute left-[37.5%] w-[25%]">
          <span style="color: #b5b4b2">2022</span>
        </div>
        <div class="absolute left-[62.5%] w-[25%]">
          <span style="color: #b5b4b2">2023</span>
        </div>
        <div class="absolute left-[87.5%] w-[25%]">
          <span style="color: #b5b4b2">2024</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.countdown-color span {
  background-image: linear-gradient(#e8cfac, #a58a66, #c1a583);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
.custom-font {
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
.mask-bg {
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 25%,
    black 95%,
    transparent
  );
}
</style>
