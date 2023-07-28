<template>
    <div>
        <CardMerchant @data-loaded="showLineChart = true"></CardMerchant>
        <LineChart v-if="showLineChart"></LineChart>
    </div>
</template>

<script setup>
import CardMerchant from "./CardMerchant.vue";
import LineChart from "./LineChart.vue";
import {ref} from "vue";


let showLineChart = ref(false);
</script>
