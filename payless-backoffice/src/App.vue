<script setup>
import AuthProvider from './services/auth.vue';
import SecuredZoneView from "@/views/SecuredZoneView.vue";
import NavbarHome from "@/components/NavbarHome.vue";

</script>

<template>
    <AuthProvider #default="{ user }">
        <NavbarHome v-if="user === null" />
        <SecuredZoneView v-else />
    </AuthProvider>
</template>

<style scoped>

</style>
