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
        <input type="text" v-model="searchTerm" placeholder="Search Transactions...">
        <button @click="searchTransactions">🔍</button>

        <div class="table">
          <TableList>
              <template #head>
                  <tr>
                      <th>Transaction ID</th>
                      <th>Merchant</th>
                      <th>Total</th>
                      <th>Refund</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th>Action</th>
                  </tr>
              </template>
              <template #body>
                  <tr v-for="transaction in transactions" :key="transaction._id">
                      <td>{{ transaction.payment_id }}</td>
                      <td>{{ transaction.merchant.company_name }}</td>
                      <td>{{ transaction.total }}</td>
                      <td>{{ getRefund(transaction) }}</td>
                      <td>{{ transaction.currency }}</td>
                      <td>{{ transaction.status }}</td>
                      <td>
                        <Modal v-if="transaction.status === 'succeeded'">
                          <template #activator="{ openModal }">
                            <CustomButton title="Refund" :onClick="() => openModal()"></CustomButton>
                          </template>
                          <form class="modal-form">
                            <h1>Refund transaction #{{ transaction.payment_id }}</h1>
                            <label>Amount to refund ({{ transaction.currency }})</label>
                            <input type="number" v-model="refundAmount">
                            <CustomButton title="Refund" :onClick="() => refund(transaction.payment_id)"></CustomButton>
                            <p v-show="refundMessage">{{refundMessage}}</p>
                          </form>
                        </Modal>
                      </td>
                  </tr>
              </template>
          </TableList>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import transactionService from '../services/transactionService';
import TableList from "./TableList.vue";
import CustomButton from "./CustomButton.vue";
import Modal from "./Modal.vue";

const transactions = ref([]);
const searchTerm = ref('');
const searchCriterion = ref('');
const refundAmount = ref(0);
const refundMessage = ref('');

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

const refund = async (paymentId) => {
    try {
        refundMessage.value = 'Loading...';
        const response = await transactionService.refund(paymentId, refundAmount.value);
        if (response !== true) {
          if (typeof response === 'string') {
            refundMessage.value = response;
          } else if (typeof response === 'object') {
            refundMessage.value = Object.values(response).join(', ');
          }
          return;
        }
        transactions.value = await transactionService.getAllTransactions(searchTerm.value, searchCriterion.value);
        refundAmount.value = 0;
        refundMessage.value = 'Refund successfully created';
    } catch (error) {
        console.error('Refund error', error);
    }
};

const getRefund = (transaction) => {
  const operations = transaction.operations.filter(operation => operation.type === 'refund' && operation.status !== 'cancelled');
  return operations.reduce((acc, operation) => acc + Number(operation.amount), 0);
}
</script>

<style scoped>
 .table {
     margin: 20px;
 }
 .modal-form {
   gap: 20px;
   display: flex;
   flex-direction: column;
   margin: auto;
   max-width: 300px;
 }
</style>