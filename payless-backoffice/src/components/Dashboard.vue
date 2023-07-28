<template>
    <div class="dashboard">
        <div class="title">
            <h2>DASHBOARD</h2>
            <div>You'll find your KPIS on the dashboard at a glance.</div>
            <hr />
        </div>
        <CardAdmin @data-loaded="showLineChart = true"></CardAdmin>
        <LineChart v-if="showLineChart"></LineChart>
    </div>
</template>

<script setup>
import CardAdmin from "./CardAdmin.vue";
import LineChart from "./LineChart.vue";
import {ref} from "vue";

let showLineChart = ref(false);
</script>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
}
.title {
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #4e4e4e;
}

.dashboard {
    padding: 40px;
}
</style>
