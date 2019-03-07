/* ============
 * Getters for the contextSituation  module
 * ============
 *
 * The getters that are available on the
 * contextSituation  module.
 */
import Vue from 'vue'

import { getGraphNodes } from '@/vuex/common/helpers'

function pushToChildren(tagMap, id, data) {
  const tag = tagMap.get(id)
  tag.children.push(data)
  tagMap.set(id, tag)
}

export default {
  contextSituationGraphNodes(state) {
    return getGraphNodes(state.contextSituations, 'situation', 'context_situations.single', 'contextSituationID')
  },

  contextSituationsByTags(state, getters, rootState) {
    const tagMap = new Map()
    tagMap.set('untagged', {
      value: '0',
      label: Vue.i18n.t('context_situation.untagged'),
      children: []
    })
    rootState.tag.tags.forEach(tag => {
      tagMap.set(tag.id, {
        value: tag.id,
        label: tag.name,
        children: []
      })
    })
    state.contextSituations.forEach((cS) => {
      const cSData = {
        value: cS,
        key: cS.id,
        label: cS.name
      }
      if (cS.tags && cS.tags.length > 0) {
        cS.tags.forEach((tag) => {
          pushToChildren(tagMap, tag.id, cSData)
        })
      } else {
        pushToChildren(tagMap, 'untagged', cSData)
      }
    })
    return [...tagMap.values()]
  }
}
