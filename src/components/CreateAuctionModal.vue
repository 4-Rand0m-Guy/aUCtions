<template>
  <div id="createAuctionModal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create an auction</p>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label is-3">Auction title*</label>
            <div class="control">
              <input id="title" class="input is-1" type="text" placeholder="Auction title" v-model="title"
                     required>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Auction Start Date*</label>
            <div class="control">
              <input id="startDate" class="input is-1" :min="minDate" type="date" v-model="startDate"
                     required>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Auction End Date*</label>
            <div class="control">
              <input id="endDate" class="input is-1" :min="minDate" type="date" v-model="endDate"
                     required>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Description*</label>
            <textarea class="textarea" placeholder="Please enter a description" id="description" required
                      v-model="description"></textarea>
          </div>
          <div class="is-grouped">
            <label class="label is-3"> Select a category*</label>
            <div class="select is-grouped">
              <select id="categories" v-model="categoryId" required>
                <option disabled selected value> -- select an option -- </option>
                <option v-for="cat in categories"  :value="cat.categoryId">{{cat.categoryTitle
                  }}</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Starting bid</label>
            <div class="control has-icons-left">
              <input id="startingBid" class="input is-1" type="number" placeholder="Starting bid value"
                     v-model="startingBid">
              <span class="icon is-small is-left">
                <i class="fas fa-dollar-sign"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label is-3">Reserve</label>
            <div class="control has-icons-left">
              <input id="reserve" class="input is-1" type="number" placeholder="Reserve price" v-model="reserve">
              <span class="icon is-small is-left">
                <i class="fas fa-dollar-sign"></i>
              </span>
            </div>
          </div>
          <div class="file">
            <label class="file-label">
              <input class="file-input" type="file" name="image" @change="onFileChange">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                  Choose a file…
                </span>
              </span>
              <p>&emsp;Upload an Image</p>
            </label>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="createAuction">Create Auction</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from "../auth";
  export default {
    name: "createAuctionModal",
    data: function () {
      return {
        user: auth.user,
        title: "",
        startDate: Date.now(),
        endDate: Date.now(),
        description: "",
        categoryId: 0,
        categories: [],
        reserve: 0,
        startingBid: 0,
        imageUp: false,
        image : null,
        minDate: Date.now()
      }
    },
    mounted: function () {
      this.getCategories()
    },
    methods: {
      getCategories: function () {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then((response) => {
            for (let i=0; i<response.data.length; i++) {
              this.categories.push(response.data[i]);
              console.log(response.data[i].categoryId);
            }
          }, (error) => {
            alert("A problem occurred trying to receive categories: " + error)
          })
      },
      createAuction: function () {
        if (this.auctionValid()) {
          let token = localStorage.getItem("user_token");
          let sending = JSON.stringify({
            "categoryId": parseInt((this.categoryId).toString()),
            "title": this.title,
            "description": this.description,
            "startDateTime":new Date(this.startDate + "T00:00:00Z").getTime(),
            "endDateTime": new Date(this.endDate+ "T00:00:00Z").getTime(),
            "reservePrice": parseInt(this.reserve.toString()) * 100,
            "startingBid": parseInt(this.startingBid.toString()) * 100
          });
          this.$http.post("http://localhost:4941/api/v1/auctions", sending, {
            headers: {
              "content-type": "application/json",
              "X-Authorization": token
            }
          })
            .then((response) => {
              this.$router.push("/auction/" + response.data.id);
              if (this.image) {
                console.log("uploading image");
                this.onUpload(response.data.id);
              }
              alert("Successfully created a new auction")
            }, (error) => {
              alert("Something went wrong, unable to create the auction: " + error.status);
              console.log(sending);
            })
        } else {
          alert("Some the fields are not correct, please check red highlighted cells.")
        }

      },
      auctionValid: function () {
        let valid = true;
        let items = [];
        items.push(document.getElementById("title"), document.getElementById("startDate"),
          document.getElementById("endDate"), document.getElementById("description"),
          document.getElementById("categories"), document.getElementById("startingBid"),
          document.getElementById("reserve"));
        for (let i=0; i< items.length; i++) {
          if(!items[i].checkValidity()) {
            valid = false;
          }
        }
        return valid;
      },
      onFileChange: function (e) {
        this.image = e.target.files[0];
      },
      onUpload: function (auctionID) {
        this.$http.post("http://localhost:4941/api/v1/auctions/" + auctionID + "/photos",
          this.image, { emulateJSON: false ,headers: {
              "X-Authorization": localStorage.getItem("user_token"),
              "Content-Type": "image/jpeg"
            }
          }).then(response => {
          console.log("Successful image updload")
        }, error => {
          console.log("Failed to upload image" + error.data)
        });
      }
    }
  }
</script>

<style scoped>
  input:invalid {
    border: solid 1px red;
  }
  input:valid {
    border: solid 1px green;
  }
  textarea:invalid{
    border: solid 1px red
  }
  textarea:valid{
    border: solid 1px green;
  }
  select:invalid {
    border: solid 1px red
  }

  select:valid {
    border: solid 1px green;
  }
</style>
