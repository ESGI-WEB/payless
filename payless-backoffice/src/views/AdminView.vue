<template>
coucou
</template>

<script setup>
import authService from '../services/authService';
import router from "../router";

const logout = async () => {
    try {
        await authService.logout();
        await router.push('/');
    } catch (error) {
        console.error('Logout Error', error);
    }
};
</script>

<style scoped>
</style>
