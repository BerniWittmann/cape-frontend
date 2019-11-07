import inherits from 'inherits'

import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'

import {
  bind, assign
} from 'min-dash'

function createSubProcessListener(event) {
  const shape = this.elementFactory.createShape(assign({ type: 'bpmn:SubProcess' }, { isExpanded: false }))

  shape.businessObject.di.isExpanded = false

  this.create.start(event, shape)
}

function createExtensionAreaListener(event) {
  const shape = this.elementFactory.createShape(assign({ type: 'cape:ExtensionArea' }))

  this.create.start(event, shape)
}

function getPaletteEntries(element) {
  const actions = this.cached(element)

  delete actions['create.start-event']
  delete actions['create.end-event']

  actions['create.subprocess-collapsed'] = {
    ...actions['create.subprocess-expanded'],
    className: 'bpmn-icon-subprocess-collapsed',
    title: this.translate('Create collapsed SubProcess'),
    action: {
      dragstart: this.subProcessListener,
      click: this.subProcessListener
    }
  }
  actions['create.extension-area'] = {
    group: 'custom',
    className: 'bpmn-icon-extension-area',
    title: this.translate('Create Extension Area'),
    action: {
      dragstart: this.extensionAreaListener,
      click: this.extensionAreaListener
    }
  }

  delete actions['create.subprocess-expanded']

  return actions
}

/**
 * Customizes the Palette which shows the available Elements on the left side
 *
 */
export default function CustomPaletteProvider(injector) {
  injector.invoke(PaletteProvider, this)

  this.elementFactory = injector.get('elementFactory')
  this.create = injector.get('create')
  this.translate = injector.get('translate')

  this.cached = bind(this.getPaletteEntries, this)

  this.subProcessListener = createSubProcessListener.bind(this)
  this.extensionAreaListener = createExtensionAreaListener.bind(this)

  this.getPaletteEntries = getPaletteEntries.bind(this)

  return this
}

inherits(CustomPaletteProvider, PaletteProvider)

CustomPaletteProvider.$inject = [
  'injector', 'elementFactory', 'create'
]
