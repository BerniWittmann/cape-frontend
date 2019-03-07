/* ============
 * Getters for the injectionMapping  module
 * ============
 *
 * The getters that are available on the
 * injectionMapping  module.
 */

export default {
  getInjectionMappings: (state) => (processID, extensionAreaID) => {
    return state.injectionMappings.filter(im => {
      return im.processID === processID && im.extensionAreaID === extensionAreaID
    })
  }
}
