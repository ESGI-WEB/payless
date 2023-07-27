<template>
    <div>
        <h1>Admin View</h1>

        <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/merchantlist">Merchant List </router-link></li>
            <li><router-link to="/transaction">Transaction List </router-link></li>
        </ul>

        <router-view/>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import authService from '../services/authService';
import router from "../router";

const logout = async () => {
    try {
        await authService.logout();
        await router.push('/login');
    } catch (error) {
        console.error('Logout Error', error);
    }
};
</script>

