<template>
    <div class="container">
        <form @submit.prevent="submitForm" class="form-container">

            <div class="form-section">
                <h2>Information</h2>
                <div>
                    <label for="company_name">Company Name</label>
                    <input type="text" id="company_name" v-model="formData.company_name" required>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" required>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="formData.password" required>
                </div>
                <div>
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" v-model="formData.confirmpassword" required>
                </div>
            </div>

            <div class="form-section">
                <h2>Place</h2>
                <div>
                    <label for="address">Address</label>
                    <input type="text" id="address" v-model="formData.address" required>
                </div>
                <div>
                    <label for="city">City</label>
                    <input type="text" id="city" v-model="formData.city" required>
                </div>
                <div>
                    <label for="zip_code">Zip Code</label>
                    <input type="number" id="zip_code" v-model="formData.zip_code" required>
                </div>
                <div>
                    <label for="country">Country</label>
                    <input type="text" id="country" v-model="formData.country" required>
                </div>
            </div>
            <div class="form-section">
                <h2> Details </h2>
                <div>
                    <label for="confirmation_url">Redirect URL for confirmation </label>
                    <input type="text" id="confirmation_url" v-model="formData.confirmation_url" required>
                </div>
                <div>
                    <label for="cancel_url">Redirect URL for cancellation</label>
                    <input type="text" id="cancel_url" v-model="formData.cancel_url" required>
                </div>
                <div>
                    <label for="merchant_url">Merchant URL</label>
                    <input type="text" id="merchant_url" v-model="formData.merchant_url" required>
                </div>
                <div>
                    <select v-model="formData.currency">
                        <option disabled value="">Currency</option>
                        <option>EUR</option>
                        <option>USD</option>
                        <option>CHF</option>
                        <option>GBP</option>
                    </select>
                </div>
                <div>
                    <label for="kbis">KBIS</label>
                    <input type="file" id="kbis" @change="keepKbisFile">
                </div>
            </div>
            <div class="form-section">
                <button type="submit">Register</button>
                <div class="link-container">
                    <router-link to="/login">Login</router-link>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import authService from '../services/authService';

export default {
    setup() {

        const formData = ref({
            company_name: '',
            email: '',
            password: '',
            address: '',
            zip_code:'',
            city: '',
            country: '',
            kbis: null,
            confirmation_url: '',
            cancel_url: '',
            merchant_url:'',
            currency: '',
        });
        const keepKbisFile = (event) => {
            formData.value.kbis = event.target.files[0];
        };
        const submitForm = async () => {
            try {
                await authService.register(formData.value);
            } catch (error) {
                console.error('Register error', error);
            }
        };

        return { formData, submitForm, keepKbisFile };
    },
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #FDF7F2;
}

.form-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    max-width: 900px;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    border-radius: 5px;
}

.form-section {
    display: flex;
    flex-direction: column;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

h3 {
    margin-bottom: 10px;
    color: #333;
}

label {
    margin-bottom: 5px;
    color: #333;
    font-size: 0.9em;
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
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 3px;
    margin-top: 10px;
}

button:hover {
    background-color: #C05640;
}

.link-container {
    text-align: center;
    margin-top: 10px;
}
</style>
