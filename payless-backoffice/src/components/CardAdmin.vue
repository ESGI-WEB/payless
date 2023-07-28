<template>
    <div class="transaction-card" v-if="dataLoaded">
        <div class="transaction-item">
            <div class="small-title">Transactions</div>
            <div class="transaction-amount">
                <div class="amount-total">{{ transactionData.total_amount }} {{ transactionData.currency }}</div>
                <div>out of {{ transactionData.number_of_transactions }}</div>
            </div>
        </div>

        <div>
            <h4>Date: {{ chartData.date }}</h4>
        </div>
        <div>
            <div>Merchants</div>
            <div>{{ merchantData.number_of_merchants }}</div>
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

.transaction-item {
    display: flex;
    flex-direction: column;
}

.transaction-amount {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 10px;
}

.small-title {
    color: #4E4E4E;
}

.amount-total {
    font-family: Amaranth;
    font-size: 2rem;
}
</style>

