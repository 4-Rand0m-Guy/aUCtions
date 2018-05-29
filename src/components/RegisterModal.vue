<template>
  <div id="registerModal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title"> Register a new account </p>
          <button class="delete" @click="$emit('close')" aria-label="close"></button>
        </header>
        <section class="modal-card-body" id="registerForm">
          <div class="field">
            <label class="label is-3">Given Name</label>
            <div class="control">
              <input id="fname" class="input is-1" type="text" placeholder="First name(s)" v-model="user.name" required>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Family Name</label>
            <div class="control">
              <input id="lname" class="input is-1" type="text" placeholder="Family name" v-model="user.familyName"
                     required>
            </div>
          </div>
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
              <input id="username" class="input" type="text" placeholder="Enter username" v-model="user.username"
                     required>
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">E-mail Address</label>
            <div class="control has-icons-left">
              <input id="email" class="input" type="email" placeholder="Enter e-mail address" v-model="user.email"
                     pattern="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" required>
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Enter password</label>
            <div class="control">
              <input id="password" class="input" type="password" placeholder="" v-model="user.password" required>
            </div>
            <div>
              <input id="passmatch" class="input" type="password" placeholder="confirm password" v-model="passMatch"
                     required
                     :pattern="user.password">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" type="submit" @click="register">Register</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
  import auth from "../auth";
  export default {
    name: "registerModal",
    data () {
      return {
        user: {
          name: "",
          familyName: "",
          username: "",
          email: "",
          password: ""
        },
        passMatch: ""
      }
    },
    methods: {
      register: function () {
        if (this.formValid()) {
          auth.registerUser(this, this.user)
        } else {
          alert("You have invalid inputs in the form, please check red cells")
        }
      },
      formValid: function () {
        let valid = true;
        let allInputs = [];
        allInputs.push(document.getElementById("password"), document.getElementById("passmatch"),
          document.getElementById("email"), document.getElementById("username"), document.getElementById("lname"),
          document.getElementById("fname"));
        console.log(allInputs.length);
        for (let i=0; i<allInputs.length; i++) {
          if (!allInputs[i].checkValidity()){
            valid = false;
            console.log(i)
          }
        }
        return valid;
      },
      registerSuccess: function () {
        this.$emit('close');
        alert("Successfully registered user");
      },
      registerFail(error) {
        alert("Something went wrong while registering user: " + error)
      }
    }
  }
</script>

<style scoped>
  input:invalid {
    border: 2px red solid;
  }

  input:valid {
    border: 2px green solid;
  }
</style>
