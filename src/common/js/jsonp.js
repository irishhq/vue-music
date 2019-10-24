import OriginJsonp from 'jsonp';

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data);
  return new Promise((resolve, reject) => {
    OriginJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

export function params(data) {
  let url = '';
  for (var k in data) {
    let value = data[k] !== 'undefined' ? data[k] : '';
    url += `&${k}=${encodeURIComponent(
      value
    )}`; /* url中含有特殊字符，将字符串作为URI组件进行编码 */
  }
  return url ? url.substring(1) : '';
}
