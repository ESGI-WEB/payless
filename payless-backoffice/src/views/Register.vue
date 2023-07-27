<template>
    <div class="container">
        <form @submit.prevent="submitForm" class="form-container">

            <div class="form-section">
                <h2>Information</h2>
                <div>
                    <label for="company_name">Company Name</label>
                    <input type="text" id="company_name" v-model="formData.company_name" required>
                    <p class="error" v-for="(error, index) in errors.company_name" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" required>
                    <p class="error" v-for="(error, index) in errors.email" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="formData.password" required>
                    <p class="error" v-for="(error, index) in errors.password" :key="index">{{error}}</p>
                </div>
            </div>

            <div class="form-section">
                <h2>Place</h2>
                <div>
                    <label for="address">Address</label>
                    <input type="text" id="address" v-model="formData.address" required>
                    <p class="error" v-for="(error, index) in errors.address" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="city">City</label>
                    <input type="text" id="city" v-model="formData.city" required>
                    <p class="error" v-for="(error, index) in errors.city" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="zip_code">Zip Code</label>
                    <input type="text" id="zip_code" v-model="formData.zip_code" required>
                    <p class="error" v-for="(error, index) in errors.zip_code" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="country">Country</label>
                    <input type="text" id="country" v-model="formData.country" required>
                    <p class="error" v-for="(error, index) in errors.country" :key="index">{{error}}</p>
                </div>
            </div>
            <div class="form-section">
                <h2> Details </h2>
                <div>
                    <label for="confirmation_url">Redirect URL for confirmation </label>
                    <input type="text" id="confirmation_url" v-model="formData.confirmation_url" required>
                    <p class="error" v-for="(error, index) in errors.confirmation_url" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="cancel_url">Redirect URL for cancellation</label>
                    <input type="text" id="cancel_url" v-model="formData.cancel_url" required>
                    <p class="error" v-for="(error, index) in errors.cancel_url" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="merchant_url">Merchant URL</label>
                    <input type="text" id="merchant_url" v-model="formData.merchant_url" required>
                    <p class="error" v-for="(error, index) in errors.merchant_url" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="merchant_url">Webhook URL</label>
                    <input type="text" id="merchant_url" v-model="formData.webhook_url" required>
                    <p class="error" v-for="(error, index) in errors.webhook_url" :key="index">{{error}}</p>
                </div>
                <div>
                    <select v-model="formData.currency">
                        <option disabled value="">Currency</option>
                        <option>EUR</option>
                        <option>USD</option>
                        <option>CHF</option>
                        <option>GBP</option>
                    </select>
                    <p class="error" v-for="(error, index) in errors.currency" :key="index">{{error}}</p>
                </div>
                <div>
                    <label for="kbis">KBIS</label>
                    <input type="file" id="kbis" @change="keepKbisFile">
                    <p class="error" v-for="(error, index) in errors.kbis" :key="index">{{error}}</p>
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

<script setup>
import {reactive, ref} from 'vue';
import {useRouter} from "vue-router";
import authService from '../services/authService';

const router = useRouter();
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
    webhook_url:'',
    currency: '',
});

const errors = reactive({});

const keepKbisFile = (event) => {
    formData.value.kbis = event.target.files[0];
};

const submitForm = async () => {
    try {
        for(const key in errors) {
            errors[key] = [];
        }

        const response = await authService.register(formData.value);

        if (response.status === 201) {
          await router.push("/login");
        } else {
          Object.assign(errors, await response.json());
        }
    } catch (error) {
        console.error('Register error', error);
    }
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

.error {
  color: red;
  font-size: 0.8em;
  margin: 0 0 10px 0;
}
</style>
