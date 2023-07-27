<template>
    <div>
        <h1>Waiting Page</h1>
        <p>Please wait, your role is not validated yet.</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import authService from "../services/authService";
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
