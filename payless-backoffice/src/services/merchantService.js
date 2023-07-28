const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export default {

async getAllMerchants(page = 1, limit = 10) {
        const response = await fetch(`${API_BASE_URL}/users?_page=${page}&_itemsPerPage=${limit}&_sort[id]=DESC`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error about merchant: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

    async getMerchantTransactions() {
        const response = await fetch(`${API_BASE_URL}/payments`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error on data merchant');
        }

        return await response.json();
    },

     async getMerchantDetails(merchantId) {
        const response = await fetch(`${API_BASE_URL}/users/${merchantId}`);

        if (!response.ok) {
            throw new Error('Error on merchant');
        }

        return await response.json();
    },

    /*
    async generateNewCredentials(merchantId) {
        const response = await fetch(`/api/merchants/${merchantId}/credentials`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la génération des nouvelles informations d\'identification du marchand');
        }

        return await response.json();
    }, */

    async validateMerchantRole(merchantId) {
        const response = await fetch(`${API_BASE_URL}/users/${merchantId}/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.status !== 200) {
            if (response.status === 422) {
                return await response.json()
            }
            throw new Error('Error in validation');
        }

        return true;
    },
    async refuseMerchantRole(merchantId) {
    const response = await fetch(`${API_BASE_URL}/users/${merchantId}/refuse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error in validation refuse');
    }

    return true;
    },
};
