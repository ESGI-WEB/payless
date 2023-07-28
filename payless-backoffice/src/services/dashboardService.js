const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
    async getChartData(currency) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            };

            const merchantData = await fetch(`${VITE_BASE_URL}/payments/get-merchant`, {headers}).then(res => res.json())
            const chartData = await fetch(`${VITE_BASE_URL}/payments/get-chart-data`, {headers}).then(res => res.json())
            const transactionData = await fetch(`${VITE_BASE_URL}/payments/get-amount-and-number-of-transactions?currency=${currency}`, {headers}).then(res => res.json())


            return {
                merchantData: merchantData[0],
                chartData: chartData[0],
                transactionData: transactionData[0]
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }

    },

    async getData(filterParams = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            };
            const urlParams = new URLSearchParams(filterParams);
            const chartData = await fetch(`${VITE_BASE_URL}/payments/get-chart-data?${urlParams}`, {headers}).then(res => res.json())

            return {
                chartData: chartData[0],
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}
