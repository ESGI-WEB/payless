<template>
    <div>
        <h1>Details payment {{ transaction.id }}</h1>
        <p>
            <strong>ID:</strong> {{ transaction.id }}
        </p>
        <p>
            <strong>Amount:</strong> {{ transaction.amount }}
        </p>
        <p>
            <strong>Status:</strong> {{ transaction.status }}
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import transactionService from '../services/transactionService';
import { useRoute } from 'vue-router';

const route = useRoute();
const transaction = ref(null);

onMounted(async () => {
    try {
        const transactionId = route.params.id;
        transaction.value = await transactionService.getTransactionDetails(transactionId);
    } catch (error) {
        console.error('Transaction details error ', error);
    }
});
</script>
