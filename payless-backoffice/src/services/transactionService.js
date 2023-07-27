const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export default {

    async getAllTransactions() {
        const response = await fetch('${API_BASE_URL}/payment/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error on payment: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

    async getTransactionDetails(transactionId) {
        const response = await fetch(`/${API_BASE_URL}/payment/${transactionId}`);

        if (!response.ok) {
            throw new Error('Payment detail error');
        }

        return await response.json();
    },

    async searchTransactions(searchTerm) {
        const response = await fetch(`${API_BASE_URL}/payment}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error on transaction search: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

    /*
    async refundTransaction(transactionId, amount) {
        const response = await fetch(`/${API_BASE_URL}/payment/${transactionId}/refund`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
            throw new Error('Refund error');
        }

        return await response.json();
    },*/
};
