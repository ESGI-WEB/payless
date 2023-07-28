<template>
    <div>
        <h1>Merchant</h1>

        <MerchantTransactionList/>

        <button @click="logout">Logout</button>

    </div>
</template>

<script setup>
import MerchantTransactionList from "../components/MerchantTransactionList.vue";
import {inject} from "vue";
import {logoutKey} from "@/services/authKeys";

const logout = inject(logoutKey)

</script>


