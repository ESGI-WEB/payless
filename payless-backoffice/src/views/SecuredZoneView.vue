<script setup>
import { inject } from 'vue'
import { logoutKey } from '../services/authKeys'
import { RouterLink } from 'vue-router'

const logout = inject(logoutKey)
</script>

<template>
    <div class="sidenav-section">


  <nav class="sidenav">
    <div class="logo-items">
      <div class="logo">
        <img src="../assets/images/logo.png" />
        <a class="icon"> PayLess. </a>
      </div>
      <div class="items-nav-horizontal">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/transaction">Transactions</RouterLink>
        <RouterLink to="/merchantlist">Merchants</RouterLink>
        <a>Account</a>
      </div>
    </div>
    <div class="logout">
      <button @click="logout()">Logout</button>
    </div>
  </nav>
  <RouterView />
    </div>
</template>

<style scoped>
.logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > img {
    width: 30px;
  }
}
nav {
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  justify-content: space-between;
  background-color: #fdf7f2;
}
.icon {
  font-family: Amaranth;
}

.sidenav {
  padding: 30px;
  gap: 30px;
  display: flex;
  flex-direction: column;
  width: 200px;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
  background-color: #fdf7f2;
}
.logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > img {
    width: 30px;
  }
}
a {
  cursor: pointer;
  text-decoration: inherit;
  color: #4e4e4e;
}
.icon {
  font-family: Amaranth;
}
.items-nav-horizontal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
button {
  cursor: pointer;
  border: 0;
  background-color: #eb6c4e;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
}
.logo-items {
  gap: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sidenav-section {
    display: flex;
    flex-direction: row;
}
</style>
