const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export default {

    async getAllTransactions(page = 1, limit = 10) {
        const response = await fetch(`${API_BASE_URL}/payments?_page=${page}&_itemsPerPage=${limit}&_sort[_id]=1`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error on payment: ${response.statusText}, Response: ${text}`);
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

    async searchTransactions(searchCriterion, searchTerm) {
        const response = await fetch(`${API_BASE_URL}/payments?${searchCriterion}=${searchTerm}`, {
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
    },*/


    async refund(transactionId, amount) {
        const response = await fetch(`${API_BASE_URL}/payments/${transactionId}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                amount,
            }),
        });

        if (response.status !== 200) {
            if (response.status === 422) {
                return await response.json()
            }
            if (response.status === 403) {
                return 'A refund is already processing';
            }

            return 'You cannot refund this payment';
        }

        return true;
    },
};
