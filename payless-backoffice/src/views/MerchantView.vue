<template>
    <div>
        <h1>Merchant</h1>

        <button @click="logout">Logout</button>

        <MerchantDashboard/>
        <MerchantSpace/>
        <MerchantTransactionList/>

    </div>
</template>

<script>
import MerchantDashboard from '../components/MerchantDashboard.vue';
import MerchantSpace from '../components/MerchantSpace.vue';
import authService from '../services/authService';
import MerchantTransactionList from "../components/MerchantTransactionList.vue";
import router from "../router";

export default {
    components: {
        MerchantTransactionList,
        MerchantDashboard,
        MerchantSpace,
    },
    setup() {
        const logout = async () => {
            try {
                await authService.logout();
                await router.push("/login");
            } catch (error) {
                console.error('Logout Error :', error);
            }
        };

        return { logout };
    },
};
</script>
