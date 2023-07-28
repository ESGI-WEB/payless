<script setup>
import {computed} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#EB6C4E',
  },
  onClick: {
    type: Function,
    default: () => {}
  }
});

const style = computed(() => {
  return {
    backgroundColor: props.color,
  }
});
</script>

<template>
  <button v-on:click="onClick" class="btn" :style="style" type="button">
    {{ props.title }}
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: blue;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
</style>