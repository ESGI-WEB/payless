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
import authService from '../services/authService';
import router from "../router";
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

const logout = async () => {
    try {
        await authService.logout();
        await router.push("/login");
    } catch (error) {
        console.error('Logout Error :', error);
    }
};

</script>


