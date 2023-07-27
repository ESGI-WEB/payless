<template>
    <div>
        <h1>List of payment</h1>
        <input v-model="searchTerm" @input="search" placeholder="Search transactions..." />
        <ul>
            <li v-for="transaction in transactions" :key="transaction.id">
                <router-link :to="`/transaction/${transaction.id}`">{{ transaction.id }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import transactionService from '../services/transactionService';

export default {
    name: 'TransactionList',
    data() {
        return {
            transactions: [],
            searchTerm: ''
        };
    },
    methods: {
        async search() {
            try {
                this.transactions = await transactionService.searchTransactions(this.searchTerm);
            } catch (error) {
                console.error('Search error', error);
            }
        }
    },
    async created() {
        try {
            this.transactions = await transactionService.getAllTransactions();
        } catch (error) {
            console.error('Payment error', error);
        }
    },
};
</script>

