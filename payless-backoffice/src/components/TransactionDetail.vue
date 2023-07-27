<template>
    <div>
        <h1>Details payment {{ transaction.id }}</h1>
        <p>
            <strong>ID:</strong> {{ transaction.id }}
        </p>
        <p>
            <strong>Amount:</strong> {{ transaction.amount }}
        </p>
        <p>
            <strong>Status:</strong> {{ transaction.status }}
        </p>
    </div>
</template>

<script>
import transactionService from '../services/transactionService';

export default {
    name: 'TransactionDetails',
    data() {
        return {
            transaction: null,
        };
    },
    async created() {
        try {
            const transactionId = this.$route.params.id;
            this.transaction = await transactionService.getTransactionDetails(transactionId);
        } catch (error) {
            console.error('Transaction details error ', error);
        }
    },
};
</script>
