export function addClass(el, className) {
  // if (hasClass(el, className)) {
  //   return
  // } else {
    console.log('类名数组', classArr)
    let classArr = el.className.split(' ')
    classArr.push(className)
    el.className = classArr.join(' ')
  // }
}

export function hasClass(el, className) { } 