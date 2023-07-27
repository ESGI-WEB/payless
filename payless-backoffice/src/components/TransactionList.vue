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

<script setup>
import { ref, onMounted } from 'vue';
import transactionService from '../services/transactionService';

const transactions = ref([]);
const searchTerm = ref('');
const searchCriterion = ref('');

onMounted(async () => {
    try {
        transactions.value = await transactionService.getAllTransactions(searchTerm.value, searchCriterion.value);
    } catch (error) {
        console.error('Transaction error', error);
    }
});

const searchTransactions = async () => {
    if (searchCriterion.value && searchTerm.value) {
        try {
            transactions.value = await transactionService.searchTransactions(searchCriterion.value, searchTerm.value);
        } catch (error) {
            console.error('Search error', error);
        }
    }
};
</script>
