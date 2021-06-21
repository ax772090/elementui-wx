const defaultError = 'Server Error 500';
const defaultTimeout = 'Request Timeout';
const xhr = (method, url, data = null, cb) => {
  return new window.Promise((resolve, reject) => {
    // 1.new xhr
    const xhr = new XMLHttpRequest();
    const doReject = (xhr) => {
      reject(xhr.response || xhr.statusText || defaultError);
    };
    // 2.open方法
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 10000;
    if (cb) cb(xhr);
    // 3.onload事件
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          let response = xhr.response;
          const type = xhr.getResponseHeader('Content-Type');
          // 针对zip的处理
          if (type.indexOf('zip') > -1) {
            let filename = 'style.zip';
            const disposition = xhr.getResponseHeader('content-disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
              var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              var matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
              }
            }
            var blob = new Blob([response], { type });
            var zipUrl = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = zipUrl;
            link.download = filename;
            link.click();
            resolve(response);
            return;
          }
          try {
            response = JSON.parse(xhr.response);
          } catch (e) {}
          resolve(response);
        } else {
          doReject(xhr);
        }
      } else {
        doReject(xhr);
      }
    };
    xhr.onerror = () => {
      doReject(xhr);
    };
    xhr.ontimeout = () => {
      xhr.abort();
      reject(defaultTimeout);
    };
    // 4.send方法
    xhr.send(JSON.stringify(data));
  });
};

export const post = (url, data, cb) => {
  return xhr('POST', url, data, cb);
};

export const get = (url) => {
  return xhr('GET', url);
};
