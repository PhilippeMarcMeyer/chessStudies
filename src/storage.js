
class ManageStorage {
  
    initRemote () {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://jsonblob.com/api/jsonBlob/887579374078148608");
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            try{
              let data = JSON.parse(xhr.response);
              resolve(data);

            }catch(e){
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
