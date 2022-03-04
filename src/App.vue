<script setup>
import { ref, reactive, computed, watch } from "vue"
import ToDoList from "./components/ToDoList.vue"
import Analyse from "./components/Analyse.vue"
import Clock from "./components/Clock.vue"
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import alarm from '/music/alarm.mp3'
import don from '/music/don.mp3'
import yay from '/music/yay.mp3'

//webpack沒有對mp3解析路徑，需要自己來...
const alarmUrl = ref(alarm)
const donUrl = ref(don)
const yayUrl = ref(yay)

const store = useStore()

const sidebarStatus = reactive({
  listStatus: false,
  analyseStatus: false,
  mainStatus: false
})

function sidebarOpen(status) {
  //if open then close
  if (sidebarStatus[status]) {
    Object.keys(sidebarStatus).forEach(key => {
      sidebarStatus[key] = false;
    })
  } else {
    //if close then open (others close)
    Object.keys(sidebarStatus).forEach(key => {
      sidebarStatus[key] = false;
    })
    sidebarStatus[status] = !sidebarStatus[status]
    sidebarStatus.mainStatus = true
  }
}

let countDown //timer
const timerStatus = ref(false) //工作狀態
const restStatus = ref(true) //休息狀態

const workTime = 25 * 60
const restTime = 5 * 60
const countDownTime = ref(workTime)
const seconds = computed(() => Math.floor(countDownTime.value % 60))
const minutes = computed(() => Math.floor((countDownTime.value / 60) % 60))

function playSound(path) {
  const audio = document.getElementById(path)
  audio.currentTime = 0;
  audio.play();
}

function startTimer() {
  timerStatus.value = true
  restStatus.value = false
  countDown = setInterval(() => {
    countDownTime.value -= 1
    if (!countDownTime.value) {
      playSound('audio-yay')
      clearCount()
      startRestTimer()
    }
  }, 1000)
}

function startRestTimer() {
  timerStatus.value = true
  restStatus.value = true
  countDownTime.value = restTime
  countDown = setInterval(() => {
    countDownTime.value -= 1
    if (!countDownTime.value) {
      playSound('audio-alarm')
      clearCount()
      startTimer()
      countDownTime.value = workTime
    }
  }, 1000)
}

function pauseTimer() {
  timerStatus.value = false
  clearCount()
  restStatus.value = true
}

function clearCount() {
  clearInterval(countDown)
  timerStatus.value = false
}

function resetCount() {
  countDownTime.value = workTime
  clearCount()
  restStatus.value = true
}

const ringbellStatus = ref(true)
function ringbellToggle(element) {
  playSound(element)
  ringbellStatus.value = !ringbellStatus.value
}
</script>

<template>
  <audio id="audio-don" :src="donUrl" :muted="!ringbellStatus"></audio>
  <audio id="audio-alarm" :src="alarmUrl" :muted="!ringbellStatus"></audio>
  <audio id="audio-yay" :src="yayUrl" :muted="!ringbellStatus"></audio>
  <div class="flex selection:bg-green-100">
    <div class="flex flex-col justify-center h-screen w-[80px] bg-gray-200 z-20">
      <button
        class="hover:bg-gray-50 focus:ring ring-gray-50 ring-inset w-full p-4"
        @click="sidebarOpen('listStatus')"
      >
        <img src="/images/icon-list.svg" class="mx-auto" alt />
      </button>
      <button
        class="hover:bg-gray-50 focus:ring ring-gray-50 ring-inset w-full p-4"
        @click="sidebarOpen('analyseStatus')"
      >
        <img src="/images/icon-analysis.svg" class="mx-auto" alt />
      </button>
    </div>
    <div
      class="relative flex flex-col h-screen justify-between bg-[#304030] text-white w-full overflow-hidden"
    >
      <ToDoList :listStatus="sidebarStatus.listStatus" />
      <Analyse :analyseStatus="sidebarStatus.analyseStatus" />
      <div class="text-right opacity-60 p-7">
        <Clock />
      </div>
      <div class="flex duration-500" :class="{ 'translate-x-1/2': sidebarStatus.mainStatus }">
        <div class="flex flex-col justify-center time w-1/2">
          <span
            class="text-[150px] lg:text-[200px] mx-auto"
          >{{ ('0' + minutes).slice(-2) }} : {{ ('0' + seconds).slice(-2) }}</span>
          <div class="mx-auto">
            <button
              type="button"
              class="relative border-2 rounded-full p-3 mr-3 hover:bg-secondary"
              @click="ringbellToggle('audio-don')"
            >
              <img src="/images/icon-bell.svg" alt class />
              <hr class="absolute w-full top-1/2 left-0 rotate-45 border" v-if="!ringbellStatus" />
            </button>
            <button
              type="button"
              class="bg-white border rounded-full p-5 mr-3 hover:bg-transparent"
              @click="startTimer()"
              v-if="!timerStatus"
            >
              <img src="/images/icon-play--orange.svg" alt class />
            </button>
            <button
              type="button"
              class="bg-white border rounded-full p-5 mr-3 hover:bg-transparent"
              @click="pauseTimer"
              v-else
            >
              <img src="/images/icon-pause--orange.svg" alt class />
            </button>
            <button
              type="button"
              class="border-2 rounded-full p-3 mr-3 hover:bg-secondary"
              @click="resetCount"
            >
              <img src="/images/icon-cancel.svg" alt class />
            </button>
          </div>
        </div>
        <div class="pt-10 lg:pt-16">
          <ul class="p-5 max-h-96 overflow-y-auto" v-if="!restStatus">
            <li
              class="flex items-center text-4xl first-of-type:font-bold mb-10"
              v-for="item in store.getters.thisWeekJobs.active"
              :key="item.id"
            >
              <div class="w-16">
                <div
                  class="w-10 h-10 border-4 rounded-full mx-auto"
                  :class="{ 'animate-ping': timerStatus }"
                  v-if="store.getters.thisWeekJobs.active[0].id === item.id"
                ></div>
                <div class="w-7 h-7 border-2 rounded-full mx-auto" v-else></div>
              </div>
              <span>{{ item.content }}</span>
            </li>
            <!-- <li
              class="flex items-center text-xl mb-8"
              v-for="item in store.getters.thisWeekJobs.active"
              :key="item.id"
            >
              <div class="w-16">
                <div class="w-7 h-7 border-2 rounded-full mx-auto"></div>
              </div>
              <span>學習 Javascript</span>
            </li>-->
          </ul>
          <div class="px-10" v-else>
            <p class="font-bold text-8xl mb-5">休息</p>
            <p class="text-4xl">是為下一次的努力。</p>
          </div>
        </div>
      </div>
      <img
        src="/images/tomato--orange.svg"
        alt
        class="container object-fit max-h-96 mx-auto duration-500"
        :class="{ 'translate-x-1/2': sidebarStatus.mainStatus }"
        v-if="!restStatus"
      />
      <img
        src="/images/tomato--green.svg"
        alt
        class="container object-fit max-h-96 mx-auto duration-500"
        :class="{ 'translate-x-1/2': sidebarStatus.mainStatus }"
        v-else
      />
    </div>
  </div>
</template>

<style></style>
