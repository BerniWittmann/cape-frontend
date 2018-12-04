import inherits from 'inherits'

import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'

import {
  bind
} from 'min-dash'

/**
 * Customizes the Palette which shows the available Elements on the left side
 *
 */
export default function CustomPaletteProvider(injector) {
  injector.invoke(PaletteProvider, this)

  this.cached = bind(this.getPaletteEntries, this)

  this.getPaletteEntries = function (element) {
    const actions = this.cached(element)

    delete actions['create.start-event']
    delete actions['create.end-event']

    return actions
  }

  return this
}

inherits(CustomPaletteProvider, PaletteProvider)

CustomPaletteProvider.$inject = [
  'injector'
]
