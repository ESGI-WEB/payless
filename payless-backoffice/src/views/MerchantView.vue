<template>
    <div>
        <h1>Merchant</h1>

        <MerchantCard :user="merchant"/>

        <MerchantTransactionList/>

        <button @click="logout">Logout</button>

    </div>
</template>

<script setup>
import MerchantTransactionList from "../components/MerchantTransactionList.vue";
import {inject} from "vue";
import {logoutKey} from "@/services/authKeys";
import MerchantCard from "../components/MerchantCard.vue";
import {onMounted, reactive} from "vue";
import merchantService from "../services/merchantService";

const merchant = reactive({});

onMounted(async () => {
  try {
    const user = await merchantService.me();
    if (user) {
      Object.assign(merchant, user);
    }
  } catch (error) {
    console.error('Error payment merchant', error);
  }
});

const logout = inject(logoutKey)

</script>


