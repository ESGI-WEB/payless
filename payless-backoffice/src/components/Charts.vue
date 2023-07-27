<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { Chart } from 'chart.js'

const props = defineProps({
    data: Object,
    options: Object
})

const canvas = ref(null)
let chart = null

watchEffect(() => {
    if (chart) {
        chart.destroy()
        chart = null
    }
    chart = new Chart(canvas.value, {
        type: 'line', // Change this for the type of chart you want
        data: props.data,
        options: props.options
    })
})

onMounted(() => {
    chart = new Chart(canvas.value, {
        type: 'line', // Change this for the type of chart you want
        data: props.data,
        options: props.options
    })
})
</script>
