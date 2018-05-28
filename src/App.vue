<template class="container-fluid" xmlns:>
  <div id="app">
    <div id="heading">
      <h1>{{heading}}</h1>
      <div>
        <router-link class="navBtn" :to="{ name: 'home'}" tag="button"><i class="fa fa-home"></i>
          Home
        </router-link>
        <router-link class="navBtn" :to="{ name: 'auctions'}" tag="button"><i class="fa fa-btc"></i>
          Auctions
        </router-link>
      </div>
    </div>
    <div>
      <router-view>
      </router-view>
    </div>
    <div>
      <login-modal v-show="showLoginModal" @close="showLoginModal=false"></login-modal>
      <button @click="showLoginModal=true">Show Modal</button>
    </div>
  </div>
</template>

<script>
  import LoginModal from "./components/LoginModal";

  export default {
    name: 'app',
    components: {LoginModal},
    data() {
      return {
        heading: "aUCtions",
        loggedIn: false,
        showLoginModal: true
      }
    }
  }
</script>

<style scoped>
  #heading {
    background-size: inherit;
    background: url("./assets/headers.jpeg") center;
    opacity: 0.8;
    border: 1px grey solid;
    height: 100px;
    width: 100%;
  }

  #heading h1 {
    opacity: 1;
    margin: 0;
    text-align: center;
    color: deepskyblue;
    font-weight: bold;
    font-family: Lobster, monospace;
    font-size: 400%;
  }

  .navBtn{
    border-radius: 2px;
    margin: 0 1em 1em 1em;
  }
  .navBtn:hover{
    color: gold;
    fill: gold;
    background-color: darkgrey;
  }
</style>
