export function select() {
  return d3
}

export function selectAll() {
  return d3
}

export function on(key, fn) {
  d3._listeners[key] = fn
  return d3
}

export function attr(key, value) {
  d3._attrs[key] = value
  return d3
}

const d3 = {
  isD3: true,
  select,
  selectAll,
  on,
  attr,
  _listeners: {},
  _attrs: {}
}

export default d3
