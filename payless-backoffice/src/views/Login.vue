<template>
    <form @submit.prevent="submitForm">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required>

        <label for="password">Password:</label>
        <input type="password" id="password" v-model="formData.password" required>

        <button type="submit">Sign in</button>
        <div class="link-container">
            <router-link to="/register" class="centre">Register</router-link>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import authService from '../services/authService';

const router = useRouter();

const formData = ref({
    email: '',
    password: '',
});

const submitForm = async () => {
    try {
        await authService.login(formData.value.email, formData.value.password);
        if(authService.isAdmin()){
            return router.push("/admin");
        } else if(authService.isMerchant()){
            return router.push("/merchant");
        } else{
            return router.push("/waiting")
        }
    } catch (error) {
        console.error('Error with the connection', error);
    }
};
</script>

<style scoped>
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #FDF7F2;
}

form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 20px auto;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    border-radius: 5px;
}

label {
    margin-bottom: 5px;
    color: #333;
    font-size: 0.9em;
    font-family: serif;
}

input {
    padding: 6px;
    margin-bottom: 10px;
    border: 1px solid #aaa;
    border-radius: 3px;
}

button {
    padding: 8px;
    background-color: #EB6C4E;
    color: #F6CA88;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 3px;
}

button:hover {
    background-color: #C05640;
}

.link-container {
    text-align: center;
    margin-top: 10px;
}
</style>
