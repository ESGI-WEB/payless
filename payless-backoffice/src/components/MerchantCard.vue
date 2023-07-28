<template>
  <p v-show="!user">Chargement en cours...</p>
  <div v-show="user">
    <p>Id : {{ user.id }}</p>
    <p>Name : {{ user.company_name }}</p>
    <p>Secret token : {{ user.secret_token }}</p>
    <p>Client token : {{ user.client_token }}</p>
  </div>
</template>

<script setup>

defineProps({
  user: {
    type: Object,
    required: true
  }
});

</script>
