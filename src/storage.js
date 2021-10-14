
class ManageStorage {
  constructor(props) {
    this.url = ""; // use only in dev stage, leave empty in prod
  }
    initRemote = () => {
      const url = this.url+"games";
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url,true);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              try {
                let data = JSON.parse(xhr.response);
                resolve(data);
              } catch (e) {
                reject({"error":"invalid json"});
              }
            } else {
              reject({"error":xhr.statusText});
            }
          };
          xhr.onerror = function () {
            reject({"error":xhr.statusText});
          };
          xhr.send();
      });
    }

    deleteRemote = (id) =>{
      const url = this.url + "game/"+ id;
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("DELETE", url,true);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.onload = function (result) {
            if (this.status >= 200 && this.status < 300) {
              resolve(result);
            } else {
              reject({"error":xhr.statusText});
            }
          };
          xhr.onerror = function () {
            reject({"error":xhr.statusText});
          };
          xhr.send();
      });
    }

    login = (username,pw) => {
      username = username.trim();
      pw = pw.trim();
      const url = this.url+ "login";
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST",url,true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function (result) {
          if (this.status >= 200 && this.status < 300) {
            resolve(result);
          } else {
            reject({"error":xhr.statusText});
          }
        };
        xhr.onerror = function () {
          reject({"error":xhr.statusText});
        };
        let data = {username:username,password:pw};
        xhr.send(JSON.stringify(data));
    });
    }

    setRemote = (data) => {
      if(Array.isArray(data)){
        data = data[0];
      }
      const url = this.url+ "game";
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT",url,true);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.onload = function (result) {
            if (this.status >= 200 && this.status < 300) {
              resolve(result);
            } else {
              reject({"error":xhr.statusText});
            }
          };
          xhr.onerror = function () {
            reject({"error":xhr.statusText});
          };
          xhr.send(JSON.stringify(data));
      });
    }

    setLocal(data){
      if(typeof (Storage) !== "undefined"){
      try{
        localStorage.setItem("games", JSON.stringify(data));
      }catch(e){

      }
     }
    }

    initLocal() {
        return new Promise(function (resolve, reject) {
            if(typeof (Storage) === "undefined"){
              reject("localStorage not supported");
            }else{
              if (localStorage.getItem("games") !== null) {
                let dataJson = localStorage.getItem("games");
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
  }
  export {ManageStorage};
