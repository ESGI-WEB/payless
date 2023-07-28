<template>
    <div>
        <form @submit.prevent="applyFilter">
            <select v-model="filter.period">
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
            </select>
            <input type="date" v-model="filter.startDate" placeholder="Start Date">
            <input type="date" v-model="filter.endDate" placeholder="End Date">
            <button type="submit">Filter</button>
        </form>
        <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import dashboardService from "@/services/dashboardService";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);

let myChart; // This variable will hold a reference to the chart

const chartCanvas = ref(null);
const filter = ref({
    period: 'day',
    startDate: '',
    endDate: '',
});

const fetchData = async (filterParams) => {
    // Create a new object to hold the parameters we're going to send
    const params = {};

    // Check the value of filterParams.period and add the appropriate parameters
    if (filterParams.period === 'day') {
        params.day = true; // Replace this with the actual parameter you want to send
    } else if (filterParams.period === 'month') {
        params.month = true; // Replace this with the actual parameter you want to send
    } else if (filterParams.period === 'year') {
        params.year = true; // Replace this with the actual parameter you want to send
    }

    // If startDate and endDate are provided, add them to the parameters
    if (filterParams.startDate) {
        params.startDate = filterParams.startDate;
    }
    if (filterParams.endDate) {
        params.endDate = filterParams.endDate;
    }

    return await dashboardService.getData(params);
};


const prepareChartData = (data) => ({
    labels: [data.chartData.date], // Assuming this is a single date string
    datasets: [{
        label: 'My First Dataset',
        data: [data.chartData.total],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
});

const createChart = (data) => {
    if (myChart) {
        // If there is a chart already, destroy it before creating a new one
        myChart.destroy();
    }
    myChart = new Chart(chartCanvas.value.getContext('2d'), {
        type: 'line',
        data: data,
        options: {}
    });
};

const applyFilter = async () => {
    const data = await fetchData(filter.value);
    const chartData = prepareChartData(data);
    createChart(chartData);
}

onMounted(applyFilter);
</script>
