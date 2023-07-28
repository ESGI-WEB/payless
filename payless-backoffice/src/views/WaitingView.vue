<template>
    <div>
        <h1>Waiting Page</h1>
        <p>Please wait, your role is not validated yet.</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import {inject} from "vue";
import {logoutKey} from "@/services/authKeys";

const logout = inject(logoutKey)
</script>
