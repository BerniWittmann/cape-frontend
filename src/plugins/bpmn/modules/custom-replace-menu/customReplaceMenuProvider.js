import inherits from 'inherits'

import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider'

import {
  bind
} from 'min-dash'

/**
 * Customizes the Replace Menu where an object can be replaced by a different object
 *
 */
export default function CustomReplaceMenuProvider(injector) {
  injector.invoke(ReplaceMenuProvider, this)

  this.cached = bind(this.getEntries, this)

  this.getEntries = function (element) {
    let actions = this.cached(element)

    // Hides the Replace Action to prevent it from being made to a start or end event
    actions = actions.filter((a) => {
      return !['replace-with-none-end', 'replace-with-none-start'].includes(a.id)
    })
    return actions
  }

  return this
}

inherits(CustomReplaceMenuProvider, ReplaceMenuProvider)

CustomReplaceMenuProvider.$inject = [
  'injector'
]
