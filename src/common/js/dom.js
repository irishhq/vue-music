export function addClass(el, className) {
  /* el.className结构:  slider-group aaa vbvv ccc */
  if (!hasClass(el, className)) {
    return;
  } else {
    let classArr = el.className.split(' ');
    classArr.push(className);
    el.className = classArr.join(' ');
  }
}

export function hasClass(el, className) {
  /* let reg = new RegExp('^|\\s' + className + '\\s|$')
  return reg.test(el.className) */
  return el.className.split(' ').indexOf(className)
}
