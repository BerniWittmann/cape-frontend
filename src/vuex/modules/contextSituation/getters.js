/* ============
 * Getters for the contextSituation  module
 * ============
 *
 * The getters that are available on the
 * contextSituation  module.
 */

export default {
  contextSituationGraphNodes(state) {
    return state.contextSituations.map((cS) => ({
      id: cS.id,
      name: cS.name,
      type: 'situation',
      route: {
        name: 'context_situations.single',
        params: {
          contextSituationID: cS.id
        }
      }
    }))
  }
}
