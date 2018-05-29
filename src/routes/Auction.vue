<template>
  <div id="auction">
    <div v-if="errorFlag" style="color: red">
      {{error}}
    </div>
    <div class="ultWrapper">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="box">
            <article class="media">
              <figure class="media-left">
                <p class="image is-512x512">
                  <img id=auctionImg
                       :src="'http://localhost:4941/api/v1/auctions/' + $route.params.auctionID + '/photos'">
                </p>
              </figure>
              <div class="media-content">
                <p class="title is-2">
                  {{title}}
                </p>
                <p class="title is-5 is-marginless">Seller info</p>
                <p class="desc">
                  &emsp;<strong>Username: </strong> {{seller.username}} <br/>
                  &emsp;<strong>Details: </strong> {{description}}
                </p>
                <p class="title is-5 is-marginless">Auction info</p>
                <p class="desc">
                  &emsp;<strong>Starting date: </strong> {{startDate.toString()}}<br/>
                  &emsp;<strong>Ending date: </strong> {{endDate.toString()}}<br/>
                  &emsp;<strong>Current bid: </strong> ${{currentBid}}<br/>
                  &emsp;<strong>Reserve price: </strong> ${{reservePrice}}<br/>
                  &emsp;<strong>Starting bid: </strong> ${{startingBid}}<br/>
                </p>
                <p class="title is-5">Bidding History</p>
                <div class="table-container">
                  <table class="table is-bordered">
                    <thead>
                    <tr>
                      <th>Bid Amount</th>
                      <th>Date</th>
                      <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="bid in bidHistory">
                      <td>${{(Math.round(bid.amount / 100)).toFixed(2)}}</td>
                      <td>{{Date(bid.datetime).toString()}}</td>
                      <td>{{bid.buyerUsername}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div class="column" id="biddingArea" v-if="user.authenticated">
          <div class="box">
            <article>
              <p class="title is-5">Make a bid!</p>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" type="number" placeholder="Enter bid amount" v-model="userBid">
                  <span class="icon is-small is-left">
                    <i class="fas fa-dollar-sign"></i>
                  </span>
                </p>
              </div>
              <a class="button is-dark" @click="placeBid">Bid</a>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from "../auth";

  export default {
    name: "auction",
    data() {
      return {
        user: auth.user,
        error: "",
        errorFlag: false,
        title: "",
        seller: {},
        startDate: 0,
        endDate: 0,
        description: "",
        currentBid: 0,
        reservePrice: 0,
        startingBid: 0,
        bidHistory: [],
        userBid: 0
      }
    },
    mounted: function () {
      this.getAuction();
    },
    methods: {
      getAuction() {
        this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionID)
          .then((response) => {
            this.title = response.data.title;
            this.seller = response.data.seller;
            this.startDate = new Date(response.data.startDateTime);
            this.endDate = new Date(response.data.endDateTime);
            this.description = response.data.description;
            this.currentBid = (Math.round(parseFloat(response.data.currentBid) / 100)).toFixed(2);
            this.reservePrice = (Math.round(parseFloat(response.data.reservePrice) / 100)).toFixed(2);
            this.startingBid = (Math.round(parseFloat(response.data.startingBid) / 100)).toFixed(2)
            this.bidHistory = response.data.bids;
            this.sortBids();
          }, (error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      sortBids: function () {
        console.log("sorting");

        function compare(a, b) {
          if (a.datetime < b.datetime) {
            return 1;
          }
          if (a.datetime > b.datetime) {
            return -1;
          }
          return 0;
        }

        this.bidHistory.sort(compare)
      },
      bidValidator: function () {
        let valid = false;
        if ((this.userBid >= this.currentBid + 5 && this.userBid >= this.startingBid)) {
          valid = true;
        }
        return valid;
      },
      placeBid: function () {
        if (this.bidValidator()) {
          let token = localStorage.getItem("user_token");
          this.$http.post("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionID +
            "/bids/?amount=" + (Math.round(this.userBid * 100)).toFixed(2), {}, {
            headers:
              {'x-authorization': token}
          })
            .then((response) => {
              console.log("bid sent" + response.status);
              this.getAuction();
              alert("Successfully placed bid");
            }, (error) => {
              console.log("Bid denied " + error.data);
              alert("Something went wrong, could not place bid: " + error.data)
            })
        } else {
          alert("Bids must be at least $5 higher than the last bid and need to at least meet the starting bid")
        }
      }
    }
  }
</script>

<style>
  #auction {
    background-color: lightgrey;
  }

  .desc {
    margin-bottom: 1em;
  }

  .table-container {
    overflow-y: scroll;
    max-height: 15em;
  }

  #biddingArea {
    margin-right: 1em;
  }

  .ultWrapper {
    margin-top: 1em;
  }

</style>
