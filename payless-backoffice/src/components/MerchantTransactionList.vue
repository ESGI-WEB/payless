<template>
    <div>
        <h1>List Merchant {{ merchantId }}</h1>
        <ul>
            <li v-for="transaction in transactions" :key="transaction.id">
                <router-link :to="`/transactions/${transaction.id}`">{{ transaction.id }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import merchantService from '../services/merchantService';

const route = useRoute();
const merchantId = ref(null);
const transactions = ref([]);

onMounted(async () => {
    try {
        merchantId.value = route.params.id;
        transactions.value = await merchantService.getMerchantTransactions(merchantId.value);
    } catch (error) {
        console.error('Error payment merchant', error);
    }
});
</script>
