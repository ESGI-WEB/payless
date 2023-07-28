<template>
  <div id="app">
    <nav v-if="$route.meta.showNavbar">
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/merchantlist">Merchant List </router-link></li>
        <li><router-link to="/transaction">Transaction List </router-link></li>
        <li><router-link to="admin">Admin Home</router-link></li>
      </ul>
    </nav>
    <nav v-else>
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
    <router-view />
  </div>
</template>

<script>
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
</style>
