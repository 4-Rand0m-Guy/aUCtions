<template>
  <div id="loginModal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Login</p>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <div v-if="askUsername" class="field">
            <label class="label is-3">Username</label>
            <div class="control has-text-right">
              <input class="input is-1 " type="text" placeholder="Please enter your username" required
                     id="usernameField" v-model="credentials.username">
              <a class="button is-rounded is-small is-link switchButtons " @click="switchToEmail">Use E-mail
                instead</a>
            </div>
          </div>
          <div v-else class="field">
            <label class="label is-3">E-mail address</label>
            <div class="control has-text-right">
              <input class="input is-1" type="email" placeholder="Please enter you e-mail address" required
                     pattern="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" id="emailField" v-model="credentials.email">
              <a class="button is-rounded is-small is-link switchButtons" @click="switchToUsername">Use username
                instead</a>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Password</label>
            <div class="control">
              <input class="input is-1" type="password" placeholder="Please enter your password" required
                     id="passwordField" v-model="credentials.password">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="login">Login</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from "../auth"
  export default {
    name: "loginModal",
    data() {
      return {
        credentials: {
          email: "",
          password: "",
          username: "",
        },
        askUsername: true,
        askEmail: false,
      }
    },
    mounted: function () {
      this.switchToUsername()
    },
    methods: {
      switchToUsername: function () {
        this.askUsername = true;
        this.askEmail = false
      },
      switchToEmail: function () {
        this.askUsername = false;
        this.askEmail = true
      },
      formValid: function () {
        let valid = true;
        if (this.askUsername) {
          valid = document.getElementById("usernameField").checkValidity() &&
            document.getElementById("passwordField").checkValidity();
        } if (this.askEmail) {
          document.getElementById("emailField").checkValidity() &&
          document.getElementById("passwordField").checkValidity();
        }
        return valid;
      },
      login: function () {
        if (this.formValid()) {
          auth.loginUser(this, this.credentials)
        } else {
          alert("Please enter all the login details, check red cells")
        }
      },
      successfulLogin: function () {
        this.$emit('close');
        alert("Successfully logged in")
      },
      failedLogin: function (error) {
        alert("Failed to login: " + error);
      }
    }
  }
</script>

<style scoped>
  .switchButtons {
    margin-top: 2px
  }

  .input:valid {
    border: solid 1px green;
  }

  .input:invalid {
    border: solid 1px red;
  }
</style>
