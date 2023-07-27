const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
    async getChartData() {
        //const merchantData = await fetch(`${VITE_BASE_URL}/get-merchant`).then(res => res.json())
        const chartData = await fetch(`${VITE_BASE_URL}/get-chart-data`).then(res => res.json())
        const transactionData = await fetch(`${VITE_BASE_URL}/get-amount-and-number-of-transaction`).then(res => res.json())

        return {
            //merchantData: merchantData.data,
            chartData: chartData.data,
            transactionData: transactionData.data
        }
    }
}
