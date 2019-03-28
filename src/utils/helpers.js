import { CONTEXT_SITUATION_RULES_CONNECTORS, CONTEXT_SITUATION_RULES_PART_TYPES } from '@/utils/constants'
const contextSituationRuleStringRegex = /^!?([a-z]|[0-9]){24}.([a-z]|[A-Z]|[0-9]|_)+( ((&&)|(\|\|)) !?([a-z]|[0-9]){24}.([a-z]|[A-Z]|[0-9]|_)+)*$/

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

export function getDeep(obj, path) {
  if (!path || !obj) return undefined
  const paths = path.split('.')
  let current = obj
  for (let i = 0; i < paths.length; i++) {
    current = current[paths[i]]
    if (current === undefined) return undefined
  }
  return current
}

export function scrollToTop() {
  try {
    const el = document.getElementById('app')
    el.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  } catch (e) {}
}

export function hasCommonElement(arr1, arr2) {
  let result = false
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      result = true
      break
    }
  }
  return result
}

// Transforms a Context Situation Rule String to an Array that can be edited
export function decodeContextSituationRuleString(str) {
  if (!str || !str.match(contextSituationRuleStringRegex)) return []
  return str.split(' ').map((obj) => {
    if (obj === '&&') {
      return {
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON,
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND
      }
    }
    if (obj === '||') {
      return {
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON,
        data: CONTEXT_SITUATION_RULES_CONNECTORS.OR
      }
    }
    let isNegated = false
    if (obj.indexOf('!') === 0) {
      isNegated = true
      obj = obj.slice(1)
    }
    return {
      type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG,
      data: [...obj.split('.'), isNegated]
    }
  })
}

// Transforms a Context Situation Rule Array to a logical String
export function encodeContextSituationRuleString(parts) {
  if (!parts || !Array.isArray(parts) || parts.length === 0) return ''
  return parts.map((obj) => {
    if (obj.type === CONTEXT_SITUATION_RULES_PART_TYPES.ARG && obj.data && obj.data.length > 0) {
      return (obj.data[2] ? '!' : '') + obj.data[0] + '.' + obj.data[1]
    } else if (obj.type === CONTEXT_SITUATION_RULES_PART_TYPES.CON && obj.data) {
      if (obj.data === CONTEXT_SITUATION_RULES_CONNECTORS.AND) return '&&'
      if (obj.data === CONTEXT_SITUATION_RULES_CONNECTORS.OR) return '||'
      return '##Invalid##'
    } else {
      return '##Invalid##'
    }
  }).filter((s) => s !== '##Invalid##').join(' ')
}
