<template>
    <div>
        <CardAdmin @data-loaded="showLineChart = true"></CardAdmin>
        <LineChart v-if="showLineChart"></LineChart>
    </div>
</template>

<script setup>
import CardAdmin from "@/components/CardAdmin.vue";
import LineChart from '@/components/LineChart.vue';
import {ref} from "vue";

let showLineChart = ref(false);
</script>
