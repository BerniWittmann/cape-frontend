import inherits from 'inherits'

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

import {
  bind
} from 'min-dash'

import { START_EVENT_TYPE, END_EVENT_TYPE } from '../constants'

/**
 * Customizes the Context Pad which shows some actions when clicking on a process element/shape
 *
 */
export default function CustomContextPadProvider(injector) {
  injector.invoke(ContextPadProvider, this)

  this.cached = bind(this.getContextPadEntries, this)

  this.getContextPadEntries = function (element) {
    const actions = this.cached(element)

    // Hides the Delete and Replace Action from Start and End Events
    if (element.type === START_EVENT_TYPE || element.type === END_EVENT_TYPE) {
      delete actions['delete']
      delete actions['replace']
    }
    // Hides the End Event to prevent it from being created multiple times
    delete actions['append.end-event']

    return actions
  }

  return this
}

inherits(CustomContextPadProvider, ContextPadProvider)

CustomContextPadProvider.$inject = [
  'injector'
]
