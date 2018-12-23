import inherits from 'inherits'

import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'

import {
  bind, assign
} from 'min-dash'

/**
 * Customizes the Palette which shows the available Elements on the left side
 *
 */
export default function CustomPaletteProvider(injector) {
  injector.invoke(PaletteProvider, this)

  const elementFactory = injector.get('elementFactory')
  const create = injector.get('create')
  const translate = injector.get('translate')

  this.cached = bind(this.getPaletteEntries, this)

  function createSubProcessListener(event) {
    const shape = elementFactory.createShape(assign({ type: 'bpmn:SubProcess' }, { isExpanded: false }))

    shape.businessObject.di.isExpanded = false

    create.start(event, shape)
  }

  this.getPaletteEntries = function (element) {
    const actions = this.cached(element)

    delete actions['create.participant-expanded']
    delete actions['create.start-event']
    delete actions['create.end-event']

    actions['create.subprocess-collapsed'] = {
      ...actions['create.subprocess-expanded'],
      className: 'bpmn-icon-subprocess-collapsed',
      title: translate('Create collapsed SubProcess'),
      action: {
        dragstart: createSubProcessListener,
        click: createSubProcessListener
      }
    }
    delete actions['create.subprocess-expanded']

    return actions
  }

  return this
}

inherits(CustomPaletteProvider, PaletteProvider)

CustomPaletteProvider.$inject = [
  'injector', 'elementFactory', 'create'
]
