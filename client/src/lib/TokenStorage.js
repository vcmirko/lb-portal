import axios from 'axios';
import router from '@/router'
import { useStore } from '@/store'

var TokenStorage = {

  isAuthenticated() {
    return TokenStorage.getAccessToken() !== null;
  },
  getAuthentication() {
    return {
      headers: { 'Authorization': 'Bearer ' + this.getAccessToken() }
    };
  },
  getPayload(){
    var base64Url="";
    var base64="";
    var jsonPayload="";
    try{
      base64Url = this.getAccessToken().split('.')[1];
      base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload)
    }catch(err){
      return {}
    }
  },
  getNewToken() {
    var ref=this
    return new Promise((resolve, reject) => {
      try{
        const store=useStore()
        console.log("Getting new token from server...")
        axios
          .post(`/api/v1/auth/refresh`, { refreshToken: this.getRefreshToken() })
          .then(response => {
            if(response.error){
              console.log("Getting token was error from server")
              resolve(response.message)
            }else{
              this.storeAccessToken(response.data.accessToken);
              this.storeRefreshToken(response.data.refreshToken);
              resolve(response.data.accessToken);
            }

          })
          .catch((error) => {
            console.log("Axios gave error. " + error)
            var from = router?.currentRoute.fullPath
            reject(from)
          });
      }catch(err){
        console.log(err)
      }

    });
  },

  storeAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
  },

  storeRefreshToken(refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  },

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

};

export default TokenStorage
