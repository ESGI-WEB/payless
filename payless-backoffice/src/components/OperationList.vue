<template>
    <div>
        <h2>Operation History</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Timestamp</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="operation in operations" :key="operation.id">
                <td>{{ operation.id }}</td>
                <td>{{ operation.type }}</td>
                <td>{{ operation.status }}</td>
                <td>{{ operation.timestamp }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import operationService from '../services/operationService';

const operations = ref([]);

onMounted(async () => {
    operations.value = await operationService.getAllOperation();
});
</script>
