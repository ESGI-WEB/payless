<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js'

export default {
    props: {
        data: Object,
        options: Object
    },
    setup(props) {
        const canvas = ref(null)
        let chart = null

        watch(() => props.data, () => {
            if (chart) {
                chart.destroy()
                chart = null
            }
            chart = new Chart(canvas.value, {
                type: 'line', // Changez ceci pour le type de graphique que vous voulez
                data: props.data,
                options: props.options
            })
        }, { deep: true, immediate: true })

        onMounted(() => {
            chart = new Chart(canvas.value, {
                type: 'line', // Changez ceci pour le type de graphique que vous voulez
                data: props.data,
                options: props.options
            })
        })

        return {
            canvas
        }
    }
}
</script>

<style scoped>
/* Ajoutez ici les styles pour votre composant */
</style>
