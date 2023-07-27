<template>
    <div>
        <h1>List of Transactions</h1>
        <select v-model="searchCriterion">
            <option value="">Choose a criterion</option>
            <option value="merchant.company_name">Merchant</option>
            <option value="total">Total</option>
            <option value="currency">Currency</option>
            <option value="status">Status</option>
        </select>
        <input type="text" v-model="searchTerm" placeholder="Search Transactions..." @input="searchTransactions">
        <table>
            <thead>
            <tr>
                <th>Transaction ID</th>
                <th>Merchant</th>
                <th>Total</th>
                <th>Currency</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in transactions" :key="transaction._id">
                <td>{{ transaction.payment_id }}</td>
                <td>{{ transaction.merchant.company_name }}</td>
                <td>{{ transaction.total }}</td>
                <td>{{ transaction.currency }}</td>
                <td>{{ transaction.status }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import transactionService from '../services/transactionService';

export default {
    name: 'TransactionList',
    data() {
        return {
            transactions: [],
            searchTerm: '',
            searchCriterion: '',
        };
    },
    async created() {
        try {
            this.transactions = await transactionService.getAllTransactions(this.searchTerm, this.searchCriterion);
        } catch (error) {
            console.error('Transaction error', error);
        }
    },
    methods: {
        async searchTransactions() {
            if (this.searchCriterion && this.searchTerm) {
                try {
                    this.transactions = await transactionService.searchTransactions(this.searchCriterion, this.searchTerm);
                } catch (error) {
                    console.error('Search error', error);
                }
            }
        },
    },
};
</script>
