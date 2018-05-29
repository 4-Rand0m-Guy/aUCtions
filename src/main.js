import Vue from 'vue';
import App from './App';
import Home from './routes/Home';
import Auctions from './routes/Auctions';
import Auction from "./routes/Auction";
import LoginModal from "./components/RegisterModal";
import VueRouter from "vue-router";
import VueResource from "vue-resource";

require("./assets/sass/mystyles.scss");
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path:"/auctions",
    name: "auctions",
    component: Auctions
  },
  {
    path:"/auction/:auctionID",
    name: "auction",
    component: Auction
  },
];

export const router = new VueRouter({
  routes: routes,
  mode: "history"
});

new Vue({
  el: '#app',
  router: router,
  components: {
    LoginModal
  },
  render: h => h(App)
});
