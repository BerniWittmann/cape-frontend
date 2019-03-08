import Vue from 'vue'

function pushToChildren(tagMap, id, data) {
  const tag = tagMap.get(id)
  if (!tag) return
  tag.children.push(data)
  tagMap.set(id, tag)
}

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

export function getGraphNodes(objects, type, routeName, routeID) {
  return objects.map((o) => ({
    id: o.id,
    name: o.name,
    type: type,
    route: {
      name: routeName,
      params: {
        [routeID]: o.id
      }
    }
  }))
}

export function getByTags(objects, tags) {
  const tagMap = new Map()
  tagMap.set('untagged', {
    value: '0',
    label: Vue.i18n.t('context_situation.untagged'),
    children: []
  })
  tags.forEach(tag => {
    tagMap.set(tag.id, {
      value: tag.id,
      label: tag.name,
      children: []
    })
  })
  objects.forEach((obj) => {
    const objData = {
      value: obj,
      key: obj.id,
      label: obj.name
    }
    if (obj.tags && obj.tags.length > 0) {
      obj.tags.forEach((tag) => {
        pushToChildren(tagMap, tag.id, objData)
      })
    } else {
      pushToChildren(tagMap, 'untagged', objData)
    }
  })
  return [...tagMap.values()]
}
