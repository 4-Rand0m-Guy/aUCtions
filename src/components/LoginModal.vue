<template>
  <div id="loginModal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title"> Register a new account </p>
          <button class="delete" @click="$emit('close')" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label is-3">Given Name</label>
            <div class="control">
              <input class="input is-1" type="text" placeholder="First name(s)" v-bind="user.name">
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Family Name</label>
            <div class="control">
              <input class="input is-1" type="text" placeholder="Family name" v-bind="user.familyName">
            </div>
          </div>
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
              <input class="input" type="text" placeholder="Enter username" v-bind="user.username">
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">E-mail Address</label>
            <div class="control has-icons-left">
              <input class="input" type="text" placeholder="Enter e-mail address" v-bind="user.email">
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Enter password</label>
            <div class="control">
              <input class="input" type="password" placeholder="" v-bind="user.password">
            </div>
            <div>
              <input class="input" type="password" placeholder="confirm password" v-bind="passMatch">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Register</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loginModal",
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
    }
  }
</script>

<style scoped>

</style>
