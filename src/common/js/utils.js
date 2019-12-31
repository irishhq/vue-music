function getRandomIndex(min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}

/* 打乱原始数组 */
export function shuffle(arr) {
  let _arr = arr.slice() /* 深拷贝原始数组 */
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomIndex(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}