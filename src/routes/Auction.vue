<template>
  <div>
    <div v-if="errorFlag" style="color: red">
      {{error}}
    </div>
    <div id="imageSpace">
      <img id=auctionImg :src="'http://localhost:4941/api/v1/auctions/' + $route.params.auctionID + '/photos'">
    </div>
    <div id="auctionInfo">
      <h2>{{title}}</h2>
      <h4>Seller Info:</h4>
      <div>
        <h5>Username: {{seller.username}}</h5>
      </div>
      <h4>Description:</h4>
      <div>
        <p>{{description}}</p>
      </div>
      <h4>Auction running info:</h4>
      <div>
        <h5>Start Date: {{startDate.toString()}}</h5>
        <h5>End Date: {{endDate.toString()}}</h5>
      </div>
      <h4>Current bid: ${{currentBid}}</h4>
      <h4>Bidding history:</h4>
      <div id="history">
        <table id="biddingTable">
            <tr>
              <th>Bid Amount</th>
              <th>Bid Made</th>
              <th>Username</th>
            </tr>
            <tr v-for="bid in bidHistory">
              <td>${{bid.amount}}</td>
              <td>{{Date(bid.datetime).toString()}}</td>
              <td>{{bid.buyerUsername}}</td>
            </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "auction",
    data() {
      return {
        error: "",
        errorFlag: false,
        title: "",
        seller: {},
        startDate: 0,
        endDate: 0,
        description: "",
        currentBid: 0,
        bidHistory: []
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
            this.currentBid = response.data.currentBid;
            this.bidHistory = response.data.bids;
            this.sortBids();
          }, (error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      sortBids: function () {
        console.log("sorting");

        function compare(a,b) {
          if(a.datetime < b.datetime) {
            return 1;
          }
          if (a.datetime > b.datetime) {
            return -1;
          }
          return 0;
        }
        this.bidHistory.sort(compare)
      }
    }
  }
</script>

<style>
  #imageSpace{
    max-width: 50em;
    height: 55em;
    float: left;
    margin: 1em;
  }

  #auctionInfo{
    max-width: 50em;
    height: 55em;
    float: left;
    margin: 1em;
  }

  #auctionInfo h2{
    text-align: center;
    text-underline: black;
    border-bottom: black 2px solid;
    display:  inline-block;
  }

  #auctionImg {
    max-width: 40em;
    max-height: 40em;
    margin: 3em;
    border: solid 1px lightgrey;
  }

  #history{
    max-height: 10em;
    min-height: 10em;
    display: block;
  }

  #biddingTable{
    height: 10em;
    width: 100%;
    display: block;
    border-collapse: collapse;
  }

  #biddingTable tbody, thead {
    overflow-y: auto;
    overflow-x: hidden;
    display: block;
  }

  #biddingTable td, th{
    padding: 8px;
    border: 1px solid #dddddd;
    text-align: left;
  }

  #biddingTable tr:nth-child(even) {
    background-color: lightblue;
  }
</style>
