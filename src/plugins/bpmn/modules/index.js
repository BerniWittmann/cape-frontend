import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesPanelProvider from 'bpmn-js-properties-panel/lib/provider/camunda'
import minimapModule from 'diagram-js-minimap'

import customRules from './custom-rules'
import customContextPad from './custom-context-pad'
import customPalette from './custom-palette'
import customReplaceMenu from './custom-replace-menu'

export default [
  propertiesPanelModule,
  propertiesPanelProvider,
  minimapModule,
  customRules,
  customContextPad,
  customPalette,
  customReplaceMenu
]
