<template>
    <div>
        <h1>Merchant</h1>

        <MerchantTransactionList/>

        <button @click="logout">Logout</button>

    </div>
</template>

<script setup>
import MerchantTransactionList from "../components/MerchantTransactionList.vue";
import authService from '../services/authService';
import router from "../router";

const logout = async () => {
    try {
        await authService.logout();
        await router.push("/login");
    } catch (error) {
        console.error('Logout Error :', error);
    }
};

</script>


