
class ManageStorage {
  constructor(props) {
  this.key = "887579374078148608"
  }

    initRemote = () => {
      const url = "https://jsonblob.com/api/jsonBlob/" + this.key;
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              try {
                let data = JSON.parse(xhr.response);
                resolve(data);

              } catch (e) {
                reject(e);
              }
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

    setRemote = (data) => {
      const url = "https://jsonblob.com/api/jsonBlob/" + this.key;
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", url,true);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              try {
                resolve("OK");

              } catch (e) {
                reject("KO");
              }
            } else {
              reject("KO");
            }
          };
          xhr.onerror = function () {
            reject("KO");
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
