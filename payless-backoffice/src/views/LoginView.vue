<template>
    <div class="container">
        <form @submit.prevent="submitForm" class="login-form">
            <div class="title">Login form</div>
            <div class="input-label">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="formData.email" required>
            </div>
            <div class="input-label">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="formData.password" required>

            </div>
            <button type="submit">Sign in</button>
        </form>
        <div class="arrow">
            <img src="../assets/images/arrow.png" />
        </div>
    </div>
</template>

<script setup>
import {inject, ref} from 'vue';
import {loginKey} from "@/services/authKeys";
import router from "@/router";
import VueJwtDecode from "vue-jwt-decode";

const formData = ref({
    email: '',
    password: '',
});

const login = inject(loginKey);

const submitForm = async () => {
    try {
        await login(formData.value)
        const token = localStorage.getItem('authToken')
        if(token) {
            const decodedToken = VueJwtDecode.decode(token);
            if (decodedToken.role === 'admin') {
                router.push('/dashboard')
            } else if (decodedToken.role === 'merchant') {
                router.push('/merchant')
            } else {
                router.push('/waiting-page')
            }
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
    border-radius: 20px;
}

label {
    margin-bottom: 5px;
    color: #333;
    font-size: 0.9em;
}

input,
select {
    background-color: white;
    padding: 6px;
    margin-bottom: 10px;
    border: 1px solid #aaa;
    border-radius: 3px;
}
button {
    padding: 8px;
    background-color: #EB6C4E;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 3px;
}

button:hover {
    background-color: #C05640;
}

.title {
    font-family: Amaranth;
    font-size: 1.5rem;
    text-align: center;
    margin: 20px 0;
    background-color: white;
}

.login-form {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 30px;
    gap:20px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: auto;
    height: calc(100vh - 60px);
    background-color: #FDF7F2;

}

.input-label {
    display: flex;
    flex-direction: column;
}


.arrow {
    position: absolute;
    bottom: 300px;
    left: 100px;
    > img {
        width: 200px;
    }
}
</style>
