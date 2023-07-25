<template>
    <div>
        <h2>Inscription</h2>
        <form @submit.prevent="submitForm">
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
            <div>
                <label for="address">Adresse</label>
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
            <div>
                <label for="kbis">KBIS</label>
                <input type="file" id="kbis" @change="keepKbisFile">
            </div>
            <h2>Details</h2>
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
                <button type="submit">S'inscrire</button>
                <router-link to="/login">Login</router-link>
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
                console.error('Erreur d\'inscription:', error);
            }
        };

        return { formData, submitForm, keepKbisFile };
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
