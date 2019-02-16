/* ============
 * Getters for the process module
 * ============
 *
 * The getters that are available on the
 * process module.
 */

export default {
  processGraphNodes(state) {
    return state.processes.map((p) => ({
      id: p.id,
      name: p.name,
      type: 'process',
      route: {
        name: 'process.preview',
        params: {
          processID: p.id
        }
      }
    }))
  }
}
