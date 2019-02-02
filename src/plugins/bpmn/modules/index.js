import { hasProcessModelerRulesEnabled } from '@/utils/helpers'

import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesPanelProvider from 'bpmn-js-properties-panel/lib/provider/camunda'
import minimapModule from 'diagram-js-minimap'

import customRules from './custom-rules'
import customContextPad from './custom-context-pad'
import customPalette from './custom-palette'
import customReplaceMenu from './custom-replace-menu'
import customRenderer from './custom-renderer'
import customExtensionAreaRules from './custom-extension-area-rules'
import customBPMNFactory from './custom-bpmn-factory'

const customModules = [
  customRules,
  customContextPad,
  customPalette,
  customReplaceMenu
]

let baseModules = [
  propertiesPanelModule,
  propertiesPanelProvider,
  minimapModule,
  customRenderer,
  customExtensionAreaRules,
  customBPMNFactory
]

const modules = getModules()

export default modules

export function getModules() {
  return hasProcessModelerRulesEnabled() ? baseModules.concat(customModules) : baseModules
}
