<template>
    <div class="container">
        <form @submit.prevent="submitForm" class="form-container">
            <div class="title">Registation form</div>
            <div class="section">
                <div>
                    <div class="form-section">
                        <h2>Information</h2>
                        <div class="input-label">
                            <label for="company_name">Company Name</label>
                            <input type="text" id="company_name" v-model="formData.company_name" required>
                            <p class="error" v-for="(error, index) in errors.company_name" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="formData.email" required>
                            <p class="error" v-for="(error, index) in errors.email" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="password">Password</label>
                            <input type="password" id="password" v-model="formData.password" required>
                            <p class="error" v-for="(error, index) in errors.password" :key="index">{{error}}</p>
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Place</h2>
                        <div class="input-label">
                            <label for="address">Address</label>
                            <input type="text" id="address" v-model="formData.address" required>
                            <p class="error" v-for="(error, index) in errors.address" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="city">City</label>
                            <input type="text" id="city" v-model="formData.city" required>
                            <p class="error" v-for="(error, index) in errors.city" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="zip_code">Zip Code</label>
                            <input type="text" id="zip_code" v-model="formData.zip_code" required>
                            <p class="error" v-for="(error, index) in errors.zip_code" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="country">Country</label>
                            <input type="text" id="country" v-model="formData.country" required>
                            <p class="error" v-for="(error, index) in errors.country" :key="index">{{error}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="form-section">
                        <h2> Details </h2>
                        <div class="input-label">
                            <label for="confirmation_url">Redirect URL for confirmation </label>
                            <input type="text" id="confirmation_url" v-model="formData.confirmation_url" required>
                            <p class="error" v-for="(error, index) in errors.confirmation_url" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="cancel_url">Redirect URL for cancellation</label>
                            <input type="text" id="cancel_url" v-model="formData.cancel_url" required>
                            <p class="error" v-for="(error, index) in errors.cancel_url" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="merchant_url">Merchant URL</label>
                            <input type="text" id="merchant_url" v-model="formData.merchant_url" required>
                            <p class="error" v-for="(error, index) in errors.merchant_url" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="merchant_url">Webhook URL</label>
                            <input type="text" id="merchant_url" v-model="formData.webhook_url" required>
                            <p class="error" v-for="(error, index) in errors.webhook_url" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="currency">Currency URL</label>
                            <select v-model="formData.currency">
                                <option disabled value="">Currency</option>
                                <option>EUR</option>
                                <option>USD</option>
                                <option>CHF</option>
                                <option>GBP</option>
                            </select>
                            <p class="error" v-for="(error, index) in errors.currency" :key="index">{{error}}</p>
                        </div>
                        <div class="input-label">
                            <label for="kbis">KBIS</label>
                            <input type="file" id="kbis" @change="keepKbisFile">
                            <p class="error" v-for="(error, index) in errors.kbis" :key="index">{{error}}</p>
                        </div>
                    </div>
                    <div class="form-section">
                        <button type="submit">Register</button>
                    </div>
                </div>
            </div>
            <div class="title"></div>
        </form>
        <div class="arrow">
            <img src="../assets/images/arrow.png" />
        </div>
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
    flex-direction: column;
    flex: auto;
    height: calc(100vh - 60px);
    background-color: #FDF7F2;

}

.form-container {
    border-radius: 20px;
    margin: 20px;
    background-color: white;
}

.form-section {
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 5px 20px;
}

.title {
    font-family: Amaranth;
    font-size: 1.5rem;
    text-align: center;
    margin: 20px 0;
    background-color: white;
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
    margin-top: 10px;
    width: 100%;
}

button:hover {
    background-color: #C05640;
}

h2 {
    margin-bottom: 10px;
}

.error {
    color: red;
    font-size: 0.8em;
    margin: 0 0 10px 0;
}

.section {
    display: flex;
    flex-direction: row;
    border-radius: 20px;
    > div {
        background-color: white;
    }
}

.input-label {
    display: flex;
    flex-direction: column;
}

h2, label, input{
    background-color: white;
}

@media screen and (max-width: 768px) {
    .section {
        flex-direction: column;
    }

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