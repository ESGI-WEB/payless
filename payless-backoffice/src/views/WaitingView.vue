<template>
    <div>
        <h1>Waiting Page</h1>
        <p>Please wait, your role is not validate</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
import authService from "../services/authService";
import router from "../router";

export default {
    setup() {
        const logout = async () => {
            try {
                await authService.logout();
                await router.push('/login');
            } catch (error) {
                console.error('Logout Error', error);
            }
        };

        return { logout };
    },
};
</script>


