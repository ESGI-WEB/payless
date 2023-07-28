<template>
    <div>
        <h1>List Merchant</h1>
        <TableList>
          <template #head>
            <tr>
              <th>Transaction</th>
              <th>Total</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="transaction in transactions" :key="transaction._id">
              <td>
                <router-link :to="`/transactions/${transaction.id}`">
                  {{ transaction.id }}
                </router-link>
              </td>
              <td>{{ transaction.total }}</td>
              <td>{{ transaction.currency }}</td>
              <td>{{ transaction.status }}</td>
            </tr>
          </template>
        </TableList>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import merchantService from '../services/merchantService';
import TableList from "./TableList.vue";

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
