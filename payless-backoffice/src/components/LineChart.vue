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
        <div className="chart-container">
            <canvas ref="chartCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale} from 'chart.js';
import dashboardService from "@/services/dashboardService";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);

let myChart;

const chartCanvas = ref(null);
const filter = ref({
    period: 'day',
    startDate: '',
    endDate: '',
});

const fetchData = async (filterParams) => {
    const params = {
        time: filterParams.period,
    };
    if (filterParams.startDate) {
        params.startDate = filterParams.startDate;
    }
    if (filterParams.endDate) {
        params.endDate = filterParams.endDate;
    }

    return await dashboardService.getData(params);
};

const prepareChartData = (dataList) => {

    const sortedDataList = dataList.sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = sortedDataList.map(data => data.date);
    const datasetData = sortedDataList.map(data => data.total);

    return {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: datasetData,
            fill: false,
            borderColor: '#EB6C4E',
            tension: 0.1
        }]
    };
};

const createChart = (data) => {
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(chartCanvas.value.getContext('2d'), {
        type: 'line',
        data: data,
        options: {}
    });
};

const applyFilter = async () => {
    const dataList = await fetchData(filter.value);
    console.log(dataList)
    const chartData = prepareChartData(dataList.chartData);
    createChart(chartData);
}

onMounted(applyFilter);
</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: #f5f5f5;
}

form {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 2rem;
    background-color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

form > select, form > input {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
}

form > button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: #fff;
    background-color: #EB6C4E;
    border: none;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
}

form > button:hover {
    background-color: #EB6C4E;
}

.chart-container {
    width: 80%;
    height: 500px;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.chart-container > canvas {
    width: 100%;
    height: 100%;
}
</style>
