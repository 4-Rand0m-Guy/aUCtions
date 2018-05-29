<template class="container-fluid" xmlns:>
  <div id="app">
    <section class="hero">
      <div class="hero-head" id="heading">
        <div  class="columns"> <!--Global Header-->
          <div class="column">
            <h1>{{heading}}</h1>
            <div class="columns is-gapless">
              <div class="column is-left is-one-fifth" id="navZone">
                <router-link class="navBtn" :to="{ name: 'home'}" tag="button"><i class="fa fa-home"></i>
                  Home
                </router-link>
                <router-link class="navBtn" :to="{ name: 'auctions'}" tag="button"><i class="fab fa-bitcoin"></i>
                  Auctions
                </router-link>
              </div>
              <div class="column is-four-fifths" >
                <div v-if="!user.authenticated" class="field is-grouped is-pulled-right" id="userNav">
                  <p class="control ">
                    <a class="button is-primary is-small" id="registerBtn" @click="showRegisterModal=true">
                      Register
                    </a>
                  </p>
                  <p class="control">
                    <a class="button is-primary is-small" id="loginBtn" @click="showLoginModal = true">
                      Login
                    </a>
                  </p>
                </div>
                <div v-else class="field is-pulled-right">
                  <p class="control">
                    <a class="button is-primary is-small" id="logoutBtn" @click="logout">
                      Logout
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div><!--RouterView-->
      <router-view>
      </router-view>
    </div>
    <div> <!--Extra-->
      <register-modal v-show="showRegisterModal" @close="showRegisterModal=false">
      </register-modal>
    </div>
    <div>
      <LoginModal v-show="showLoginModal" @close="showLoginModal=false"></LoginModal>
    </div>
  </div>
</template>

<script>
  import auth from "./auth"
  import RegisterModal from "./components/RegisterModal";
  import LoginModal from "./components/LoginModal";
  export default {
    name: 'app',
    components: {LoginModal, RegisterModal: RegisterModal},
    data() {
      return {
        user: auth.user,
        heading: "aUCtions",
        showRegisterModal: false,
        showLoginModal: false,
        loggedIn: false,
        loggedUser: 0,
        userToken: ""
      }
    },
    methods: {
      logout: function () {
        auth.logoutUser();
      }
    }
  }
</script>

<style scoped>
  #app {
    background-color: lightgrey;
  }
  #heading {
    background-size: cover;
    background: url("./assets/money.jpg") repeat center;
    display: block;
    min-width: 100%;
    opacity: 0.8;
    border: 1px lightgrey solid;
    height: 7em;

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

  .navBtn {
    position: relative;
    border-radius: 2px;
  }

  .navBtn:hover {
    color: gold;
    fill: gold;
    background-color: darkgrey;
  }


</style>
