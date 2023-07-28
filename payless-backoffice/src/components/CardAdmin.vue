<template>
    <div class="transaction-card" v-if="dataLoaded">
        <h3>Payment</h3>

        <div>
            <h4>Amount : {{ transactionData.total_amount }}</h4>
        </div>

        <div>
            <h4>Currency: {{ transactionData.currency }}</h4>
        </div>

        <div>
            <h4>Date: {{ chartData.date }}</h4>
        </div>
        <div>
            <h4>Number of merchant: {{ merchantData.number_of_merchants }}</h4>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import dashboardService from '../services/dashboardService';

const dataLoaded = ref(false);
const transactionData = ref([]);
const merchantData = ref([]);
const chartData = ref([]);
const emit = defineEmits(['data-loaded']);

onMounted(async () => {
    try {
        const currency = 'EUR';
        const data = await dashboardService.getChartData(currency);
        transactionData.value = data.transactionData;
        merchantData.value = data.merchantData;
        chartData.value = data.chartData;
        console.log(data);

        dataLoaded.value = true;

        // Emit data-loaded event
        emit('data-loaded');

    } catch (error) {
        console.error('Error loading data:', error);
    }
});
</script>

<style scoped>
</style>
