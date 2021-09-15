
class ManageStorage {
    constructor() {
      this.remote = {
          url:"https://jsonblob.com/api/jsonBlob/",
          token:"887579374078148608", // not a big secret (use you own by saving a first mundane object on https://jsonblob.com/)
          data:[],
          inError:false,
          errorMessage:""
      };
      this.local = {
        key:"games",
        data:[],
        inError:false,
        errorMessage:""
      }

    }

    initRemote(successCallback, failureCallback){
        return new Promise((successCallback, failureCallback) => {
        this.makeRequest('GET', this.remoteUrl())
            .then(function (data) {
                try{
                    this.remote.data = JSON.parse(data);
                }catch(e){
                    this.remote.inError = true;
                    this.remote.errorMessage = e;
                }
            })
            .catch(function (e) {
                this.remote.inError = true;
                this.remote.errorMessage = e.statusText;
            });
        });
    }

    initLocal(successCallback, failureCallback) {
        return new Promise((successCallback, failureCallback) => {
            this.local.inError = (typeof (Storage) !== "undefined");
            if (localStorage.getItem(this.local.key) !== null) {
                try {
                    this.local.data = JSON.parse(localStorage.getItem(this.local.key));
                } catch (e) {
                    this.local.inError = true;
                    this.local.errorMessage = e;
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

    makeRequest (method, url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
            } else {
              reject({
                status: this.status,
                statusText: xhr.statusText
              });
            }
          };
          xhr.onerror = function () {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          };
          xhr.send();
        });
      }
  }

  export {Storage};
