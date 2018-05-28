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
              <input class="input is-1" type="text" placeholder="Name and Surname">
            </div>
          </div>

        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loginModal"
  }
</script>

<style scoped>

</style>
