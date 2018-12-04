import moddleExtensions from '@/plugins/bpmn/moddleExtensions'

jest.mock('camunda-bpmn-moddle/resources/camunda', () => ({ name: 'camunda' }))

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('ModdleExtensions', () => {
      it('exports an object', () => {
        expect(moddleExtensions).toEqual(expect.any(Object))
      })

      it('has the correct configuration Keys', () => {
        expect(moddleExtensions).toMatchSnapshot()
      })
    })
  })
})
