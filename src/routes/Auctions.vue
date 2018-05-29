<template>
  <div id="auctions">
    <div v-if="errorFlag" style="color: red">
      {{error}}
    </div>
    <div>
      <div>
        <div class="field is-grouped" id="narrowing">
          <button class="button" v-on:click="addStatusParam('')">All Auctions</button>
          <button class="button" v-on:click="addStatusParam('active')">Active Auctions</button>
          <button class="button" v-on:click="addStatusParam('expired') ">Expired Auctions</button>
          <label class="label">Select category:</label>
          <div class="select">
            <label>
              <select v-model="picked">
                <option value="all">All</option>
                <option v-for="category in categories" :value="category.categoryId">{{category.categoryTitle}}</option>
              </select>
            </label>
          </div>
          <button class="applyBtn" v-on:click="addCategoryParam">Apply</button>
          <form action="" class="search">
            <label>
              <input type="text" placeholder="search" v-model="searchQuery"/>
            </label>
          </form>
          <button class="applyBtn" v-on:click="searchAuctions">Search</button>

        </div>
        <div class="columns">
          <div class="column is-half">
            <h3 class="title is-1">Showing {{status}} auctions</h3>
            <div v-for="auction in this.displayed.slice(this.index, this.index + this.numResults)" class="box">
              <article class="media">
                <figure class="media-left">
                  <p class="image is-256x256">
                    <img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'"/>
                  </p>
                </figure>
                <div class="media-content ">
                  <div class="content">
                    <router-link :to="{name: 'auction', params: {auctionID: auction.id}}">
                      <strong>Title: </strong>
                      <p>{{auction.title}}</p>
                      <strong>Starting Times:</strong>
                      <p>{{new Date(auction.startDateTime).toString()}}</p>
                      <strong>Closing Time: </strong>
                      <p>{{new Date(auction.endDateTime).toString()}}</p>
                    </router-link>
                  </div>
                </div>
              </article>
            </div>
            <div id="pages">
              <p>displaying {{start}}-{{index + numResults}} results of {{auctions.length}}
                <button class="pageNav" v-on:click="indexSubtract"> <<</button>
                <button class="pageNav" v-on:click="indexAdd"> >></button>
              </p>
            </div>
          </div>
          <div id="creationWrapper">
            <p class="buttons" v-if="user.authenticated">
              <a class="button is-large has-icon-left is-link" @click="showCreateAuctionModal=true">
              <span class="icon">
                <i class="fab fa-autoprefixer"></i>
              </span>
                <span>Create a new Auction</span>
              </a>
            </p>
          </div>
        </div>
      </div>
      <create-auction-modal v-show="showCreateAuctionModal" @close="showCreateAuctionModal=false">
      </create-auction-modal>
    </div>
  </div>
</template>

<script>
  import auth from "../auth";
  import CreateAuctionModal from "../components/CreateAuctionModal";
  export default {
    name: "auctions",
    components: {CreateAuctionModal},
    data() {
      return {
        user: auth.user,
        error: "",
        errorFlag: false,
        parameters: "",
        auctions: [],
        displayed: [],
        index: 0,
        start: 0,
        defaultNumResults: 4,
        numResults: 4,
        searchQuery: "",
        categories: [],
        picked: "",
        category: "",
        status: "all",
        showCreateAuctionModal: false,
      }
    },
    mounted: function () {
      this.getAuctions();
      this.getCategory();
    },
    methods: {
      getAuctions: function () {
        let string = "";
        if (this.parameters === "") {
          string = "http://localhost:4941/api/v1/auctions";
        } else {
          string = "http://localhost:4941/api/v1/auctions" + this.parameters;
        }
        this.$http.get(string)
          .then((response) => {
            this.auctions = response.data;
            this.displayed = response.data;
            this.index = 0;
            this.start = this.index + 1;
            this.numResults = this.getNumResults(response.data.length);
          }, (error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getCategory: function () {
        let string = "http://localhost:4941/api/v1/categories";
        this.$http.get(string)
          .then((response) => {
            this.categories = response.data;
          }, (error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addStatusParam: function (value) {
        let regStat = RegExp("status=[a-z]*");
        let regCat = RegExp("category-id=");
        if (value !== "all") {
          if (!regCat.test(this.parameters) && !regStat.test(this.parameters)) {
            this.parameters += "?" + "status=" + value;
          } else if (regStat.test(this.parameters)) {
            this.parameters = this.parameters.replace(regStat, "status=" + value)
          } else if (this.parameters.length !== 0) {
            this.parameters += "";
          }
        } else {
          this.status = "all";
          if (regCat.test(this.parameters)) {
            this.parameters = "?" + "status=" + this.picked;
          } else if (regStat.test(this.parameters)) {
            this.parameters = "";
          }
        }
        if (value !== "") {
          this.status = value;
        } else {
          this.status = "all"
        }

        this.getAuctions();
      },
      addCategoryParam: function () {
        let regStat = RegExp("status=");
        let regCat = RegExp("category-id=[0-9]*");
        if (this.picked !== "") {
          if (!regStat.test(this.parameters) && !regCat.test(this.parameters)) {
            this.parameters += "?" + "category-id=" + this.picked;
          } else if (regCat.test(this.parameters)) {
            this.parameters = this.parameters.replace(regCat, ("category-id=" + this.picked))
          } else if (this.parameters.length !== 0) {
            this.parameters += "&" + "category-id=" + this.picked;
          }
        } else {
          if (regCat.test(this.parameters) && regStat.test(this.parameters)) {
            this.parameters = "?" + "status=" + this.status;
          } else {
            this.parameters = "";
          }
        }
        this.getAuctions();
      },
      indexSubtract: function () {
        this.index -= this.defaultNumResults;
        if (this.index < 0) {
          this.index = 0;
        }
        if (this.displayed.length - this.index >= this.defaultNumResults) {
          this.numResults = this.defaultNumResults;
        }
        this.start = this.index + 1;
      },
      indexAdd: function () {
        this.index += this.defaultNumResults;
        if (this.index >= this.displayed.length) {
          if (this.displayed.length <= 3) {
            this.index = 0;
          } else {
            this.index = this.displayed.length - 3;
          }
          this.numResults = this.displayed.length - this.index;
        } else {
          this.numResults = this.displayed.length - this.index;
          if (this.numResults > this.defaultNumResults) {
            this.numResults = this.defaultNumResults;
          }
        }
        this.start = this.index + 1;
      },
      getNumResults: function (total) {
        let num = this.defaultNumResults;
        if (total <= this.defaultNumResults) {
          num = total;
        }
        if (total === 0) {
          this.start = 0;
        }
        return num;
      },
      searchAuctions: function () {
        let pattern = new RegExp('' + this.searchQuery, "i");
        this.displayed = [];
        for (let i = 0; i < this.auctions.length; i++) {
          if (pattern.test(this.auctions[i].title)) {
            this.displayed.push(this.auctions[i]);
          }
        }
        if (this.displayed.length === 0) {
          this.start = 0;
        } else {
          this.start = this.index + 1;
        }
        this.numResults = this.displayed.length;
      }
    }
  }
</script>

<style scoped>
  #auctions {
    overflow: hidden;
    background-color: lightgrey;
    border-left: 1em solid lightgrey;
  }

  #pages {
    height: 10%;
    margin-bottom: 1em;
  }

  .search {
    display: inline-block;
    margin-top: 0;
    margin-left: 1em;
    margin-bottom: 1em;
  }

  #narrowing {
    margin-top: 1em;
  }

  .applyBtn {
    height: 2em;
    background-color: #efd469;
    border: grey 1px solid;
  }

  #creationWrapper{
    margin-top: 6em;
  }

</style>
