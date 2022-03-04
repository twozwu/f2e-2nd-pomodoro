<template>
    <div class="flex justify-center mb-3">
        <div class="flex font-sans">
            <button class="rounded-full hover:bg-secondary mx-3" @click="prevWeek">
                <img src="/images/icon-arrow--prev.svg" class alt />
            </button>
            {{ weekStart }} ~ {{ weekEnd }}
            <button
                class="rounded-full hover:bg-secondary mx-3"
                @click="nextWeek"
            >
                <img src="/images/icon-arrow--next.svg" class alt />
            </button>
        </div>
    </div>
    <vue3-chart-js
        :id="chart.id"
        :type="chart.type"
        :data="chart.data"
        :options="chart.options"
        ref="chartRef"
        @before-render="beforeRenderLogic"
    ></vue3-chart-js>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import { ref, getCurrentInstance, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const { proxy } = getCurrentInstance()
const store = useStore()

proxy.$emitter.on('chartUpdate', () => {
    chart.data.datasets[0].data = getToDoData(thisWeek) //畫面更新前要先改狀態
    chartRef.value.update()
})

let thisWeek = 1
let weekStart = ref(null)
let weekEnd = ref(null)
let weekdays
let perDayData = [4, 2, 8, 1]

function getWeekRange() {
    weekStart.value = proxy.$dayjs().weekday(thisWeek).format('YYYY-MM-DD')
    weekEnd.value = proxy.$dayjs().weekday(thisWeek + 6).format('YYYY-MM-DD')
}

function getWeekDays(day = 1) {
    weekdays = []
    const limit = day + 6
    for (day; day <= limit; day++) {
        weekdays.push(proxy.$dayjs().weekday(day).format('MM/DD (dd)'))
    }
    return weekdays
}

function getToDoData(day = 1) {
    perDayData = []
    const limit = day + 6

    for (day; day <= limit; day++) {
        let count = 0
        //產生這禮拜的日期
        const dayParse = proxy.$dayjs().weekday(day).format('YYYY-MM-DD')
        store.state.todos.forEach(item => {
            //將todo日期轉成timeObject方便比對日期
            const timestamp = proxy.$dayjs(item.id).startOf('day')
            //當這禮拜日期與todo日期為同一天時，計數器+1
            if (timestamp.isSame(dayParse) && item.done) {
                count += 1;
            }
        })
        perDayData.push(count) //將計數器資料儲存，然後開始下一輪
    }
    return perDayData
}

function init() {
    weekStart.value = proxy.$dayjs().weekday(1).format('YYYY-MM-DD')
    weekEnd.value = proxy.$dayjs().weekday(7).format('YYYY-MM-DD')
    weekdays = getWeekDays()
    perDayData = getToDoData()
}
init()


//prev week、next week
const chartRef = ref(null)
function prevWeek() {
    thisWeek -= 7
    getWeekRange()
    chart.data.labels = getWeekDays(thisWeek)
    chart.data.datasets[0].data = getToDoData(thisWeek)
    chartRef.value.update()
}
function nextWeek() {
    thisWeek += 7
    getWeekRange()
    chart.data.labels = getWeekDays(thisWeek)
    chart.data.datasets[0].data = getToDoData(thisWeek)
    chartRef.value.update()
}

const chart = {
    id: 'bar',
    type: 'bar',
    data: {
        labels: weekdays,
        datasets: [
            {
                label: '完成件數',
                color: '#000',
                backgroundColor: [
                    '#6C9460',
                    '#6C9460',
                    '#6C9460',
                    '#6C9460',
                    '#6C9460',
                    '#6C9460',
                    '#F08448',
                ],
                data: perDayData
            }
        ]
    },
    options: {
        plugins: {
            // subtitle: {
            //     display: true,
            //     text: 'Custom Chart Subtitle'
            // },
            // title: {
            //     display: true,
            //     text: "Chart Title 123",
            // },
        },
        //scales可以對x軸和y軸的對應的屬性進行修改，其中ticks屬性可以修改對應軸的起始值。
        scales: {
            x: {
                ticks: {
                    color: "white"
                },
                grid: {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                }
            },
            y: {
                ticks: {
                    color: "white"
                },
                grid: {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                }
            },
        },
    },
}

const beforeRenderLogic = (event) => {
    //...
    //if(a === b) {
    //  event.preventDefault()
    //}
}

</script>