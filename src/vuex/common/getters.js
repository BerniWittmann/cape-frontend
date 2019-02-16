/* ============
 * Getters
 * ============
 *
 */

export default {
  graphEdges(state) {
    // TODO return Edges between Processes, Situations, Factors for Graph instead of this mock
    return [{
      start: state.process.processes[0].id,
      end: state.contextSituation.contextSituations[0].id,
      type: 'process_situation'
    }, {
      start: state.process.processes[1].id,
      end: state.contextSituation.contextSituations[0].id,
      type: 'process_situation'
    }, {
      start: state.contextSituation.contextSituations[0].id,
      end: state.contextFactor.contextFactors[0].id,
      type: 'situation_factor'
    }, {
      start: state.contextSituation.contextSituations[0].id,
      end: state.contextFactor.contextFactors[1].id,
      type: 'situation_factor'
    }]
  }
}
