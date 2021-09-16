
class ManageStorage {
  
    constructor() {
      this.remote = {
          url:"https://jsonblob.com/api/jsonBlob/",
          token:"887579374078148608", // not a big secret (use you own by saving a first mundane object on https://jsonblob.com/)
      };
      this.local = {
        key:"games",
      }
    }

    initRemote () {
      let factory = this;
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", factory.remoteUrl());
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject(xhr.statusText);
          }
        };
        xhr.onerror = function () {
          reject(xhr.statusText);
        };
        xhr.send();
      });
    }

    initLocal() {
       let factory = this;
        return new Promise(function (resolve, reject) {
            if(typeof (Storage) === "undefined"){
              reject("localStorage not supported");
            }else{
              if (localStorage.getItem(factory.local.key) !== null) {
                let dataJson = localStorage.getItem(factory.local.key);
                try {
                    let data = JSON.parse(dataJson);
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
              }
            }
        });
    }
  
    get remoteUrl() {
      return this.concatRemoteUrl();
    }
  
    concatRemoteUrl() {
      return this.remote.url + this.remote.token;
    }


  }

  export {ManageStorage};
