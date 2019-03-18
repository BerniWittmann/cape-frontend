/* ============
 * Getters
 * ============
 *
 */

const factorRegex = new RegExp('(([a-z]|[0-9]){24})(?=.([a-z]|[0-9]){24})', 'g')

export default {
  graphEdges(state, getters) {
    return [...getters.graphEdgesProcessSituation, ...getters.graphEdgesSituationFactor]
  },

  graphEdgesProcessSituation(state) {
    return state.injectionMapping.injectionMappings.map((injectionMapping) => ({
      start: injectionMapping.processID,
      end: injectionMapping.contextSituation.id,
      type: 'process_situation'
    }))
  },

  graphEdgesSituationFactor(state) {
    const result = []
    state.contextSituation.contextSituations.forEach(situation => {
      const factors = new Set()
      let currentMatch
      while ((currentMatch = factorRegex.exec(situation.rules)) !== null) {
        factors.add(currentMatch[0])
      }

      factors.forEach(factor => {
        result.push({
          start: situation.id,
          end: factor,
          type: 'situation_factor'
        })
      })
    })
    return result
  }
}
