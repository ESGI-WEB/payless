<template>
  <nav>
    <div class="logo">
      <img src="../assets/images/logo.png" />
      <a class="icon"> PayLess. </a>
    </div>
    <div class="items-nav">
      <a>Home</a>
      <a>How it works</a>
      <a>Features</a>
      <a>Support</a>
    </div>
    <div class="account">
      <a class="log-in">Log in</a>
      <a class="register">Get Started</a>
    </div>
  </nav>
  <div class="center-section">
    <div class="text-section">
      <div class="promotion-text">Best way to manage online payment</div>
      <div class="description-text">
        A new, easy, reliable and secure way to manage payments. You can manage all your
        transactions and see your refund.
      </div>
    </div>
    <div class="card">
      <div class="mastercard">
        <img src="../assets/images/mastercard.png" />
      </div>
      <div class="arrow">
        <img src="../assets/images/arrow.png" />
      </div>
      <div class="register-button">
        <button>Create account</button>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="items-footer">
      <div>$20M+</div>
      <div>Transactions</div>
    </div>
    <div class="items-footer">
      <div>3200</div>
      <div>Retailers</div>
    </div>
    <div class="items-footer">
      <div>750+</div>
      <div>User Reviews</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 50px;
}

.mastercard {
  > img {
    width: 400px;
  }
}

.arrow {
  > img {
    width: 200px;
  }
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
nav {
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  gap: 30px;
  background-color: white;
}

.items-footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  padding: 30px;

  > div:first-of-type {
    font-family: Amaranth;
    font-size: 1.7rem;
    background-color: white;
  }

  > div:last-child {
    color: #4e4e4e;
    background-color: white;
  }
}

.promotion-text {
  font-family: Amaranth;
  font-size: 2rem;
  width: 300px;
}

.description-text {
  width: 400px;
}

.text-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 100px;
}

.register-button {
  > button {
    border: 0;
    background-color: #eb6c4e;
    border-radius: 20px;
    padding: 10px 20px;
    color: white;
  }
}

.center-section {
  gap: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
}
</style>
