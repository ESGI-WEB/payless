<template>
    <div>
        <h2>Merchant Account</h2>
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
            <template v-for="merchant in paginatedMerchants">
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
        />
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import merchantService from '../services/merchantService';
import Paginate from 'vuejs-paginate-next';

export default {
    components: {
        paginate: Paginate,
    },
    data(){
        return {componentKey : 0,}
    },
    setup() {
        const merchants = ref([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const componentKey = ref(0);

        onMounted(async () => {
            merchants.value = await merchantService.getAllMerchants();

        });
        const validateMerchant = async (id) => {
            try {
                await merchantService.validateMerchantRole(id);
                merchants.value = await merchantService.getAllMerchants();
                componentKey.value += 1;
            } catch (error) {
                console.error('Error validation', error);
            }
        };

        const refuseMerchant = async (id) => {
            try {
                await merchantService.refuseMerchantRole(id);
                merchants.value = await merchantService.getAllMerchants();
                componentKey.value += 1;
            } catch (error) {
                console.error('Error validation refuse', error);
            }
        };

        const pageCount = computed(() => {
            return Math.ceil(merchants.value.length / itemsPerPage.value);
        });

        const paginatedMerchants = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return merchants.value.slice(start, end);
        });

        const changePage = (newPageNumber) => {
            currentPage.value = newPageNumber;
        };

        return { merchants, validateMerchant, refuseMerchant, paginatedMerchants, pageCount, changePage, componentKey};
    },


};
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    list-style: none;
}
.pagination li {
    margin: 0 5px;
}
.pagination li a {
    text-decoration: none;
}
</style>

