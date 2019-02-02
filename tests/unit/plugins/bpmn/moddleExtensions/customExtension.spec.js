import customExtension from '@/plugins/bpmn/moddleExtensions/customExtension'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('ModdleExtensions', () => {
      describe('customExtension', () => {
        it('exports an object', () => {
          expect(customExtension).toEqual(expect.any(Object))
        })

        it('has the correct configuration Keys', () => {
          expect(customExtension).toMatchSnapshot()
        })
      })
    })
  })
})
