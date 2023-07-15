<template>
    <div>
        <h2>Comptes marchands</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Statut</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="compte in comptes" :key="compte.id">
                <td>{{ compte.id }}</td>
                <td>{{ compte.firstname }}</td>
                <td>{{ compte.lastname }}</td>
                <td>{{ compte.email }}</td>
                <td>{{ compte.statut }}</td>
                <td>
                    <button @click="validerCompte(compte.id)" :disabled="compte.statut === 'validé'">
                        Valider
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            comptes: [],
        };
    },
    mounted() {
        this.fetchComptesMarchands();
    },
    methods: {
        async fetchComptesMarchands() {
            try {
                const response = await fetch('https://api.example.com/comptes-marchands');
                const data = await response.json();
                this.comptes = data;
            } catch (error) {
                console.error(error);
            }
        },
        async validerCompte(compteId) {
            try {
                const response = await fetch(`https://api.example.com/comptes-marchands/${compteId}/valider`, {
                    method: 'POST',
                });
                const data = await response.json();
                const compte = this.comptes.find((c) => c.id === compteId);
                if (compte) {
                    compte.statut = data.statut;
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
});
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

button {
    padding: 6px 12px;
}
</style>
