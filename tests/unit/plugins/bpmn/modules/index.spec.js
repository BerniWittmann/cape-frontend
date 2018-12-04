import modules from '@/plugins/bpmn/modules'

jest.mock('bpmn-js-properties-panel', () => ({ name: 'properties-panel' }))
jest.mock('bpmn-js-properties-panel/lib/provider/camunda', () => ({ name: 'camunda-properties-panel' }))
jest.mock('@/plugins/bpmn/modules/custom-rules', () => ({ name: 'custom-rules' }))
jest.mock('@/plugins/bpmn/modules/custom-context-pad', () => ({ name: 'custom-context-pad' }))
jest.mock('@/plugins/bpmn/modules/custom-palette', () => ({ name: 'custom-palette' }))
jest.mock('@/plugins/bpmn/modules/custom-replace-menu', () => ({ name: 'custom-replace-menu' }))

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      it('exports an array', () => {
        expect(modules).toEqual(expect.any(Array))
      })

      it('has the correct configuration Keys', () => {
        expect(modules).toMatchSnapshot()
      })
    })
  })
})
