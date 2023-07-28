<template>
  <div class="table-container">
    <div class="title">
      <h2 class="merchant-table">MERCHANTS</h2>
      <div>Here you'll find all the merchants details.</div>
      <hr />
    </div>
    <TableList>
      <template #head>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Company name</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </template>
      <template #body>
        <template v-for="merchant in merchants">
          <tr v-if="merchant.role !== 'admin'" :key="merchant.id">
            <td>{{ merchant.id }}</td>
            <td>{{ merchant.email }}</td>
            <td>{{ merchant.company_name }}</td>
            <td>{{ merchant.role }}</td>
            <td class="actions-container">
              <template v-if="merchant.role === 'merchant-to-validate'">
                <CustomButton
                  title="✓"
                  :onClick="() => validateMerchant(merchant.id)"
                ></CustomButton>
                <CustomButton title="✖" :onClick="() => refuseMerchant(merchant.id)"></CustomButton>
              </template>
            </td>
          </tr>
        </template>
      </template>
    </TableList>
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
import { ref, onMounted, computed, nextTick } from 'vue'
import merchantService from '../services/merchantService'
import Paginate from 'vuejs-paginate-next'
import TableList from './TableList.vue'
import CustomButton from './CustomButton.vue'

const merchants = ref([])
const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchMerchants = async () => {
  let result = await merchantService.getAllMerchants(currentPage.value, itemsPerPage.value)
  merchants.value = result.data
  totalItems.value = result.totalItem
}

onMounted(fetchMerchants)

const validateMerchant = async (id) => {
  try {
    await merchantService.validateMerchantRole(id)
    await fetchMerchants()
  } catch (error) {
    console.error('Error validation', error)
    console.log(error)
  }
}

const refuseMerchant = async (id) => {
  try {
    await merchantService.refuseMerchantRole(id)
    await fetchMerchants()
  } catch (error) {
    console.error('Error validation refuse', error)
  }
}

const pageCount = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value)
})

const changePage = async (newPageNumber) => {
  currentPage.value = newPageNumber
  await nextTick(fetchMerchants)
}
</script>

<style scoped>
:deep(.pagination) {
  display: flex;
  gap: 10px;
  justify-content: center;
  list-style: none;
  padding: 1em 0;
  cursor: pointer;
}

.pagination li {
  margin: 0 5px;
}

.pagination li a {
  text-decoration: none;
  color: #333;
}

:deep(.active-page) {
  border-bottom: solid 2px;
}
.actions-container * {
  margin: 0 5px;
}

.table-container {
  padding: 40px;
}

.merchant-table {
  padding-bottom: 10px;
  font-size: 1.2rem;
  color: #4e4e4e;
}
.title {
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #4e4e4e;
}
</style>
