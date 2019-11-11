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

export function getDataAttr(el, attr, value) {
  const prefix = 'data-'
  if (value) {
    return el.target.setAttribute(prefix + attr, value);
  } else {
    return el.target.getAttribute(prefix + attr);
  }
}