<template>
  <div id="app">
    <nav v-if="$route.meta.showNavbar">
      <div @click="$router.push('/')" class="logo">
        <img src="./assets/images/logo.png" />
        <a class="icon"> PayLess. </a>
      </div>
      <div class="items-nav">
        <a @click="$router.push('/')">Home</a>
        <a>How it works</a>
        <a>Features</a>
        <a>Support</a>
      </div>
      <div class="account">
        <a @click="$router.push('/login')" class="log-in">Log in</a>
        <a @click="$router.push('/register')" class="register">Get Started</a>
      </div>
    </nav>
      <nav v-else class="sidenav">
          <div class="logo-items">
              <div class="logo">
                  <img src="./assets/images/logo.png" />
                  <a class="icon"> PayLess. </a>
              </div>
              <div class="items-nav-horizontal">
                  <router-link to="/dashboard">Dashboard</router-link>
                  <router-link to="/transaction">Transactions</router-link>
                  <router-link to="/merchantlist">Merchants</router-link>
                  <a>Account</a>
              </div>
          </div>
          <div class="logout">
              <button @click="logout()">Logout</button>
          </div>
      </nav>
    <router-view />
  </div>
</template>

<script setup>
import authService from "@/services/authService";
import router from "@/router";

async function logout() {
    console.log('logout')
    try {
        await authService.logout();
        await router.push('/');
    } catch (error) {
        console.error('Logout Error', error);
    }
};

</script>

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
    background-color: #FDF7F2;
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


.sidenav {
    padding: 30px;
    gap:30px;
    display: flex;
    flex-direction: column;
    width: 200px;
    justify-content: space-between;
    align-items: flex-start;
    height: 100vh;
    background-color: #FDF7F2;
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
    color: #4E4E4E;
}

.icon {
    font-family: Amaranth;
}

.items-nav-horizontal {
    display: flex;
    flex-direction: column;
    gap:20px
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
</style>
