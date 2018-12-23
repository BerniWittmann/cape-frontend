import loadedModules, { getModules } from '@/plugins/bpmn/modules'

jest.mock('bpmn-js-properties-panel', () => ({ name: 'properties-panel' }))
jest.mock('bpmn-js-properties-panel/lib/provider/camunda', () => ({ name: 'camunda-properties-panel' }))
jest.mock('diagram-js-minimap', () => ({ name: 'diagram-js-minimap' }))
jest.mock('@/plugins/bpmn/modules/custom-rules', () => ({ name: 'custom-rules' }))
jest.mock('@/plugins/bpmn/modules/custom-context-pad', () => ({ name: 'custom-context-pad' }))
jest.mock('@/plugins/bpmn/modules/custom-palette', () => ({ name: 'custom-palette' }))
jest.mock('@/plugins/bpmn/modules/custom-replace-menu', () => ({ name: 'custom-replace-menu' }))

const customModules = ['custom-rules', 'custom-context-pad', 'custom-palette', 'custom-replace-menu']

jest.mock('@/utils/helpers')

import * as helpers from '@/utils/helpers'

let modules = loadedModules

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      it('exports an array', () => {
        expect(modules).toEqual(expect.any(Array))
      })

      describe('the custom rules are enabled', () => {
        beforeEach(() => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockImplementation(() => true)
          modules = getModules()
        })

        it('has the correct configuration Keys', () => {
          expect(modules).toMatchSnapshot()
        })
        it('contains the custom modules', () => {
          expect.assertions(customModules.length)
          customModules.forEach(name => {
            expect(modules.map(el => el.name)).toContain(name)
          })
        })
      })

      describe('the custom rules are disabled', () => {
        beforeEach(() => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockImplementation(() => false)
          modules = getModules()
        })

        it('has the correct configuration Keys', () => {
          expect(modules).toMatchSnapshot()
        })
        it('does not contain the custom modules', () => {
          expect.assertions(customModules.length)
          customModules.forEach(name => {
            expect(modules.map(el => el.name)).not.toContain(name)
          })
        })
      })
    })
  })
})
