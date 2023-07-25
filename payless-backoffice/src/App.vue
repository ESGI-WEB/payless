<template>
    <div id="app">
        <nav v-if="$route.meta.showNavbar">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/merchantlist">Merchant List </router-link></li>
                <li><router-link to="admin">Admin Home</router-link></li>
            </ul>
        </nav>
        <router-view/>
    </div>
</template>


<script>
import { computed } from 'vue';
import login from './views/Login.vue';
import authService from './services/authService';

export default {
    components: {
        login
    },
    setup() {
    }
};
</script>

