<template>
    <div class="transaction-card" v-if="dataLoaded">
        <h3>Payment</h3>

        <div>
            <h4>Amount: {{ transactionData.total_amount }}</h4>
            <h4>Number of transactions: {{ transactionData.number_of_transactions }}</h4>
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

        dataLoaded.value = true;

        // Emit data-loaded event
        emit('data-loaded');

    } catch (error) {
        console.error('Error loading data:', error);
    }
});
</script>

<style scoped>
.transaction-card {
    background: #FFFFFF;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 2rem;
}

.transaction-card h3 {
    color: #EB6C4E;
    margin-bottom: 1.5rem;
}

.transaction-card h4 {
    color: #333;
    margin-bottom: 1rem;
    text-align: justify;
}
</style>

