export function convertHexToRgba(color, opacity = 1) {
  const c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return `rgba(${parseInt(c[1], 16)}, ${parseInt(c[2], 16)}, ${parseInt(c[3], 16)}, ${opacity})`
}

export function getCookie(name) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export function hasProcessModelerRulesEnabled() {
  const cookie = getCookie('enableProcessValidation')
  return cookie ? cookie === 'true' : true
}

export function removeByID(arr, id) {
  return arr.filter(o => o.id !== id)
}

export function updateAndSetActive(store, data, Model, moduleName) {
  data = new Model(data)
  store.dispatch(`${moduleName}/update`, data).then(() => {
    store.dispatch(`${moduleName}/setActive`, data)
  })
}
