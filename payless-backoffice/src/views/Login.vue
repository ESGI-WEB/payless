<template>
    <form @submit.prevent="submitForm">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required>

        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="formData.password" required>

        <button type="submit">Connexion</button>
        <router-link to="/register">Register</router-link>
    </form>
</template>

<script>
import { ref } from 'vue';
import authService from '../services/authService';

export default {
    setup() {
        const formData = ref({
            email: '',
            password: '',
        });

        const submitForm = async () => {
            try {
                await authService.login(formData.value.email,formData.value.password);
            } catch (error) {
                console.error('Erreur de connexion:', error);
            }
        };

        return { formData, submitForm };
    },
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin-top: 20px;
}

label {
    margin-bottom: 5px;
}

input {
    padding: 6px;
    margin-bottom: 10px;
}

button {
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}
</style>
