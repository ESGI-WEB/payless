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

<script>
import merchantService from '../services/merchantService';

export default {
    name: 'MerchantTransactionList',
    data() {
        return {
            transactions: [],
            merchantId: null
        };
    },
    async created() {
        try {
            this.merchantId = this.$route.params.id;
            this.transactions = await merchantService.getMerchantTransactions(this.merchantId);
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions du marchand', error);
        }
    },
};
</script>
