'use strict';

import Auth from './auth';
import Feed from './feed';

var authObj = new Auth();
var feedObj = new Feed();

window.checkLoginState = function(){
  authObj.checkLoginState();
}
window.login = function(){
  authObj.login();
}
window.logout = function(){
  authObj.logout();
  feedObj.reset();
}

window.getFeed = function(){
  feedObj.get();
}
window.reset = function(){
  feedObj.reset();
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : 952459271518368,
    cookie     : true,
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6'
  });

  authObj.checkLoginState();
  
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));