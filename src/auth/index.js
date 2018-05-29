import {router} from "../main"

const apiUrl = "http://localhost:4941/";
const loginUrl = apiUrl + "api/v1/users/login";
const signupUrl = apiUrl + "api/v1/users";

export default {
  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  loginUser(context, credentials) {
    context.$http.post(loginUrl, JSON.stringify({
      "username": credentials.username,
      "email": credentials.email,
      "password": credentials.password
    }), {
      headers: {
        "content-type": "application/json",
        "X-Authorization": "asf"
      }
    })
      .then((response) => {
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_token', response.data.token);
        this.user.authenticated = true;
        context.successfulLogin();
        console.log("the token is: " + response.data.token);
      }, (error) => {
        console.log("ERROR LOGGING IN " + error.data);
        context.failedLogin(error.data);
      })
  },

  registerUser: function (context, userdata) {
    context.$http.post(signupUrl, JSON.stringify({
      "username": userdata.username,
      "givenName": userdata.name,
      "familyName": userdata.familyName,
      "email": userdata.email,
      "password": userdata.password
    }))
      .then((response) => {
        console.log(response.data.id);
        context.showRegisterModal = false;
        context.registerSuccess();
        context.$http.post(loginUrl, JSON.stringify({
          "username": userdata.username,
          "email": userdata.email,
          "password": userdata.password
        })).then((response) => {
          console.log("Logged in user: " + response.data.id);
          localStorage.setItem('user_id', response.data.id);
          localStorage.setItem('user_token', response.data.token);
          this.user.authenticated = true;

        }, (error) => {
          this.user.authenticated = false;
          console.log("ERROR LOGGING IN! " + error.data)
        });
      }, (error) => {
        context.registerFail(error);
      })
  },

  logoutUser() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_token");
    this.user.authenticated = false;
  },
  checkAuth() {
    let token = localStorage.getItem("user_token");
    this.user.authenticated = !!token;

  },

}

