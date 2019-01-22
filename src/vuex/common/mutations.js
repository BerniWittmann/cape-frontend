export function update(state, key, activeKey, data) {
  state[key] = [...state[key].map((p) => p.id === data.id ? { ...data } : p)]
  if (state[activeKey] && state[activeKey].id === data.id) {
    state[activeKey] = { ...data }
  }
}

export function setActive(state, key, activeKey, data) {
  if (!data || !data.id) {
    state[activeKey] = undefined
  } else {
    state[activeKey] = state[key].find((p) => p.id === data.id)
  }
}
