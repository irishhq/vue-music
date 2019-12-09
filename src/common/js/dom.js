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

const style = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    ms: 'msTransform',
    o: 'oTransform',
    default: 'transform'
  }

  for (let key in transformNames) {
    if (style[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false /* 找不到支持厂商 */
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'default') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
