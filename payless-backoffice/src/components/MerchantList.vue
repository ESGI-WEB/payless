<template>
    <div class="table-container">
        <h2 class="merchant-table">Merchant Account</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Company name</th>
                <th>Role</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="merchant in merchants">
                <tr v-if="merchant.role !== 'admin'" :key="merchant.id">
                    <td>{{ merchant.id }}</td>
                    <td>{{ merchant.email }}</td>
                    <td>{{ merchant.company_name }}</td>
                    <td>{{ merchant.role }}</td>
                    <td>
                        <button v-if="merchant.role === 'merchant-to-validate'" @click="validateMerchant(merchant.id)">
                            Validate Role
                        </button>
                        <button v-if="merchant.role === 'merchant-to-validate'" @click="refuseMerchant(merchant.id)">
                            Refuse role
                        </button>
                    </td>
                    <td>
                        <span v-if="merchant.role === 'merchant'">Validate</span>
                        <span v-if="merchant.role === 'refused'">Refuse</span>
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
        <paginate
            :page-count="pageCount"
            :click-handler="changePage"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :active-class="'active-page'"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import merchantService from '../services/merchantService';
import Paginate from 'vuejs-paginate-next';

const merchants = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchMerchants = async () => {
    let result = await merchantService.getAllMerchants(currentPage.value, itemsPerPage.value);
    merchants.value = result.data;
    totalItems.value = result.totalItem;
};

onMounted(fetchMerchants);

const validateMerchant = async (id) => {
    try {
        await merchantService.validateMerchantRole(id);
        await nextTick(fetchMerchants);
    } catch (error) {
        console.error('Error validation', error);
    }
};

const refuseMerchant = async (id) => {
    try {
        await merchantService.refuseMerchantRole(id);
        await nextTick(fetchMerchants);
    } catch (error) {
        console.error('Error validation refuse', error);
    }
};

const pageCount = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value);
});

const changePage = async (newPageNumber) => {
    currentPage.value = newPageNumber;
    await nextTick(fetchMerchants);
};
</script>

<style scoped>
.table-container {
    width: 100%;
    margin: 0 auto;
    padding: 1em;
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
}

.merchant-table {
    width: 100%;
    border-collapse: collapse;
}

.merchant-table th, .merchant-table td {
    border: 1px solid #ddd;
    padding: 0.5em 1em;
    text-align: left;
}

.merchant-table thead {
    background-color: #f5f5f5;
    font-weight: bold;
}

:deep(.merchant-table tbody tr:nth-child(even)) {
    background-color: #f9f9f9;
}

:deep(.pagination) {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 1em 0;
}

.pagination li {
    margin: 0 5px;
}

.pagination li a {
    text-decoration: none;
    color: #333;
}

:deep(.active-page) {
    color: red;
}
</style>
