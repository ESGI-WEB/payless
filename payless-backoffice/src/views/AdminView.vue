<template>
    <div>
        <h1>Vue Admin</h1>

        <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/merchantlist">Merchant List </router-link></li>
            <li><router-link to="/transaction">Transaction List </router-link></li>

        </ul>
        <router-view/>
        <button @click="logout">Déconnexion</button>
    </div>
</template>

<script>
import Dashboard from '../components/Dashboard.vue';
import MerchantList from '../components/MerchantList.vue';
import authService from '../services/authService';
import TransactionList from "../components/TransactionList.vue";
import TransactionDetail from "../components/TransactionDetail.vue";
import router from "../router";

export default {
    components: {
        Dashboard,
        MerchantList,
    },
    setup() {
        const logout = async () => {
            try {
                await authService.logout();
                await router.push('/login');
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            }
        };

        return { logout };
    },
};
</script>
