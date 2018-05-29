<template>
  <div id="auctions">
    <div v-if="errorFlag" style="color: red">
      {{error}}
    </div>
    <div>
      <div>
        <div class="field" id="narrowing">
          <button class="button" v-on:click="addStatusParam('')">All Auctions</button>
          <button class="button" v-on:click="addStatusParam('active')">Active Auctions</button>
          <button class="button" v-on:click="addStatusParam('expired') ">Expired Auctions</button>
          <form action="" class="search">
            <label>
              <input type="text" placeholder="search" v-model="searchQuery"/>
            </label>
          </form>
          <button class="applyBtn" v-on:click="searchAuctions">Apply</button>
        </div>
        <div id="table">
          <h3 class="title is-1">Showing {{status}} auctions</h3>
          <table id="auctionList">
            <tr v-for="auction in this.displayed.slice(this.index, this.index + this.numResults)">
              <td><img class="auctionImage" :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'">
              </td>
              <td>
                <router-link :to="{name: 'auction', params: {auctionID: auction.id}}">
                  <div class="auctionRow"><h4>Title: </h4>{{auction.title}}
                    <h4>Closing Time: </h4>{{new Date(auction.endDateTime).toString()}}
                  </div>
                </router-link>
              </td>
            </tr>
          </table>
          <div id="pages">
            <p>displaying {{start}}-{{index + numResults}} results of {{auctions.length}}
              <button class="pageNav" v-on:click="indexSubtract"> <<</button>
              <button class="pageNav" v-on:click="indexAdd"> >></button>
            </p>
          </div>
        </div>
        <div id="filters">
          <h3>Select category:</h3>
          <select v-model="picked">
            <option value=""></option>
            <option v-for="category in categories" :value="category.categoryId">{{category.categoryTitle}}</option>
          </select>
          <button class="applyBtn" v-on:click="addCategoryParam">Apply</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
    export default {
    name: "auctions",
    data() {
      return {
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
        status: "all"
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
      addStatusParam: function(value) {
        let regStat = RegExp("status=[a-z]*");
        let regCat = RegExp("category-id=");
        if (value !== "") {
          if (!regCat.test(this.parameters) && !regStat.test(this.parameters)) {
            this.parameters += "?" + "status=" + value;
          } else if (regStat.test(this.parameters)){
            this.parameters = this.parameters.replace(regStat, "status=" + value)
          } else if (this.parameters.length !== 0){
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
      addCategoryParam: function() {
        let regStat = RegExp("status=");
        let regCat = RegExp("category-id=[0-9]*");
        if (this.picked !== "") {
          if(!regStat.test(this.parameters) && !regCat.test(this.parameters)) {
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
    min-height: 60em;
    max-height: 60em;

  }

  #filters{
    width: 20%;
    min-height: 55em;
    max-height: 55em;
    float: left;
  }

  #table {
    width: 50%;
    min-height: 55em;
    display: inline-block;
    float: left;
  }


  .auctionRow {
    height: 10em;
    width: 30em;
    text-wrap: normal;
  }

  .auctionImage {
    margin: 1em;
    height: 10em;
    width: 10em;
    border: black solid 1px;
  }


  #pages{
    height: 10%;
    float: bottom;
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

  .navBtn {
    margin-left: 1em;
    color: black;
    background-color: #66ff87;
    border: 1px grey solid;
    height: 2em;
    width: 9em;
    border-radius: 1em;
  }

  .applyBtn{
    height: 2em;
    background-color: #efd469;
    border:grey 1px solid;
  }

</style>
