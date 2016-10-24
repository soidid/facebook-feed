'use strict';

class Auth {
	  constructor(){
      //console.log("Auth. constructor.")
      this.loggedIn = false
    }
    isLoggedIn(){
      return this.loggedIn;
    }
    statusChangeCallback(response) {
    	if (response.status === 'connected') {
        this.loggedIn = true;
    	  this.testAPI();
    	} else if (response.status === 'not_authorized') {
    	  document.getElementById('status').innerHTML = 'Please log ' +
    	    'into this app.';
    	} else {
		  document.getElementById('status').innerHTML = 'Please log ' +
    	    'into Facebook.';
    	}
  	}
  	checkLoginState() {
  		console.log("checkLoginState")
  		let cb = this.statusChangeCallback.bind(this);
  	  	FB.getLoginStatus(function(response) {
  	  		cb(response);
  	  	});
  	}
    testAPI() {
    	console.log('Welcome!  Fetching your information.... ');
      

    	FB.api('/me', function(response) {
        console.log(response)
        document.getElementById('login').classList = ['hide'];
        document.getElementById('logout').classList = ['show'];
        document.getElementById('controlPanel').classList = ['show'];

    	  console.log('Successful login for: ' + response.name);
    	  document.getElementById('status').innerHTML =
    	    'Login as: ' + response.name;

    	});

    }
    login(){
      let cb = this.statusChangeCallback.bind(this);
      FB.login(function(response) {
          cb(response);
      }, {scope: 'email,user_likes'});
    }
    logout(){
      FB.logout(function(response) {
          // user is now logged out
          document.getElementById('status').innerHTML =
          'You have successfully logged out.';
          console.log("Logged out.");
          document.getElementById('login').classList = ['show'];
          document.getElementById('logout').classList = ['hide'];
          document.getElementById('controlPanel').classList = ['hide'];
          document.getElementById('progressIndex').innerHTML = "";
          document.getElementById('progressBlock').classList = ['hide'];
      });
    }


}
export default Auth;