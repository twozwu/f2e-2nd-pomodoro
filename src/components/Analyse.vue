<script setup>
import { ref, computed } from 'vue'
import Chart from './Chart.vue';
import dayjs from 'dayjs'
import { mapGetters } from '../assets/js/map-states.js'

defineProps({
    toDoList: Array,
    analyseStatus: Boolean
})

const { todayJobs, thisWeekJobs } = mapGetters()

</script>

<template>
    <div
        class="absolute h-screen shadow-2xl overflow-y-auto z-20 w-1/2 pt-28 px-10 -left-1/2 duration-500"
        :class="{ 'translate-x-full': analyseStatus }"
    >
        <div class="justify-between items-end">
            <span class="text-4xl">專注度分析</span>
        </div>
        <div class="lg:flex gap-12 items-center my-10">
            <div class="lg:w-1/2">
                <div class="flex">
                    <span class="mr-10 mb-5">今日</span>
                    <span class="text-white/30">{{ dayjs().format('YYYY-MM-DD') }}</span>
                </div>
                <div class="border border-white/30 rounded-lg py-5">
                    <div class="flex text-center">
                        <div class="w-1/2 border-r border-white/30">
                            <p class="text-8xl text-thirdly mb-3">{{ todayJobs.active.length }}</p>
                            <p class>代辦事項</p>
                        </div>
                        <div class="w-1/2">
                            <p class="text-8xl text-secondary mb-3">{{ todayJobs.done.length }}</p>
                            <p class>已完成</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="flex my-5 lg:mt-0">
                    <span class="mr-10">本周</span>
                </div>
                <div class="border border-white/30 rounded-lg py-5">
                    <div class="flex text-center">
                        <div class="w-1/2 border-r border-white/30">
                            <p class="text-8xl text-thirdly mb-3">{{ thisWeekJobs.active.length }}</p>
                            <p class>代辦事項</p>
                        </div>
                        <div class="w-1/2">
                            <p class="text-8xl text-secondary mb-3">{{ thisWeekJobs.done.length }}</p>
                            <p class>已完成</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="Chart">
            <Chart />
        </div>
    </div>
</template>