<template>
    <div class="dashboard">
        <div v-if="loading">
            Loading...
        </div>
        <div v-else>
            <div v-for="(chart, index) in charts" :key="index">
                <chart-component :data="chart.data" :options="chart.options"></chart-component>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChartComponent from './Charts.vue'
import DashboardService from '../services/DashboardService'

const loading = ref(true)
const charts = ref([])

onMounted(async () => {
    const response = await DashboardService.getChartData()
    charts.value = response
    loading.value = false
})
</script>
