<template>
    <div>
        <h2>Dashboard</h2>
        <div class="chart-container">
            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto'

export default defineComponent({
    mounted() {
        this.createChart();
    },
    methods: {
        createChart() {
            const chartElement = this.$refs.chart;
            const ctx = chartElement.getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Sales',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        },
    },
});
</script>

<style scoped>
.chart-container {
    width: 400px;
    height: 300px;
    margin: 20px;
}
</style>
