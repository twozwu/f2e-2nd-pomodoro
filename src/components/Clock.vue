<template>
    <span class="mr-5">{{ dayjs().format('YYYY-MM-DD') }}</span>
    <span class>{{ clock.dateTime }}</span>
</template>

<script setup>
import dayjs from 'dayjs'
import { reactive, onBeforeUnmount } from 'vue'
const clock = reactive({})
const getClock = setInterval(() => {
    // clock.date = dayjs().format('YYYY-MM-DD')
    clock.dateTime = dayjs().format('dddd HH:mm')
}, 1000)

onBeforeUnmount(() =>
    clearInterval(getClock)
)
</script>

<style>
</style>