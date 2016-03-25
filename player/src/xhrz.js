import localforage from 'localforage';

export default class xhrz {
  static get(url) {
    let self = this.self = this;
    self.localdata = localforage.createInstance({
      name: 'localdata'
    });

    return self.localdata.getItem('etag|' + url).then(function(etag) {
      return self.localdata.getItem('data|' + url).then(function(data) {
        // valid data with etag
        return self._get(url, data ? etag : null);
      });
    });
  }

  static _get(url, etag) {
    let self = this.self = this;
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('GET', url);
      if (etag) {
        xhr.setRequestHeader('If-None-Match', etag);
      }

      xhr.onload = function() {
        switch (xhr.status) {
          case 200:
            // set data with etag
            self.localdata.setItem('data|' + url, xhr.response).then(function(data) {

              // data fined now save etag 
              if (data) {
                let etag = xhr.getResponseHeader('etag');
                if (etag) {
                  self.localdata.setItem('etag|' + url, etag);
                }
              }

              resolve(xhr.response);
            });

            break;
          case 304:
            self.localdata.getItem('data|' + url).then(function(data) {
              // corrupted data
              if (!data) {
                // clear corrupted etag
                self.localdata.removeitem('etag|' + url);
                // retry without etag
                self._get(url);
              }

              resolve(data);
            });
            break;
          default:
            reject(new Error(xhr.statusText));
            break;
        }
      };

      // Handle network errors
      xhr.onerror = function() {
        reject(new Error('Network Error'));
      };

      // Make the request
      xhr.send();
    });
  }
}
