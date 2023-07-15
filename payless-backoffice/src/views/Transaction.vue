<template>
    <div>
        <h2>Transactions</h2>
        <div>
            <input v-model="recherche" placeholder="Rechercher une transaction" />
            <button @click="rechercherTransactions">Rechercher</button>
        </div>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ transaction.id }}</td>
                <td>{{ transaction.montant }}</td>
                <td>{{ transaction.statut }}</td>
                <td>
                    <button @click="afficherDetails(transaction)">Afficher détails</button>
                    <button @click="rembourserTransaction(transaction)" :disabled="transaction.statut !== 'validé'">
                        Rembourser
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-if="transactionSelectionnee">
            <h3>Détails de la transaction</h3>
            <p>ID: {{ transactionSelectionnee.id }}</p>
            <p>Montant: {{ transactionSelectionnee.montant }}</p>
            <p>Statut: {{ transactionSelectionnee.statut }}</p>
            <!-- Autres détails de la transaction -->
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            transactions: [],
            recherche: '',
            transactionSelectionnee: null,
        };
    },
    methods: {
        async rechercherTransactions() {
            try {
                const response = await fetch(`https://api.example.com/transactions?recherche=${this.recherche}`);
                const data = await response.json();
                this.transactions = data;
            } catch (error) {
                console.error(error);
            }
        },
        afficherDetails(transaction) {
            this.transactionSelectionnee = transaction;
        },
        async rembourserTransaction(transaction) {
            if (confirm('Voulez-vous vraiment rembourser cette transaction ?')) {
                try {
                    const response = await fetch(`https://api.example.com/transactions/${transaction.id}/rembourser`, {
                        method: 'POST',
                    });
                    const data = await response.json();
                    transaction.statut = data.statut;
                } catch (error) {
                    console.error(error);
                }
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

input,
button {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 6px 12px;
}
</style>
