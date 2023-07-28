<template>
  <nav>
    <div class="logo">
      <img src="../assets/images/logo.png" />
      <RouterLink to="/" class="icon"> PayLess. </RouterLink>
    </div>
    <div class="items-nav">
      <RouterLink to="/">Home</RouterLink>
      <a>How it works</a>
      <a>Features</a>
      <a>Support</a>
    </div>
    <div class="account">
      <RouterLink class="log-in" to="/login">Log in</RouterLink>
      <RouterLink class="register" to="/register">Get Started</RouterLink>
    </div>
  </nav>
  <router-view />
</template>

<script setup></script>

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

.items-nav {
  display: flex;
  flex-direction: row;
  gap: 50px;
  color: #4e4e4e;
  justify-content: center;
  flex: 1;
}

.log-in {
  color: #4e4e4e;
}

.register {
  color: white;
  background-color: #f6ca88;
  padding: 5px 15px;
  border-radius: 20px;
}

.account {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 20px;
}

a {
  cursor: pointer;
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
  text-decoration: inherit;
  color: #4e4e4e;
}

.icon {
  font-family: Amaranth;
}

button {
  cursor: pointer;
  border: 0;
  background-color: #eb6c4e;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
}
</style>
