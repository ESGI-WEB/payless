const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export default {

    async getAllOperation() {
        const response = await fetch(`${API_BASE_URL}/operation`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error about operation: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

};
