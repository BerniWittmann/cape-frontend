import CustomContextPadProvider from '@/plugins/bpmn/modules/custom-context-pad/customContextPadProvider'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('bpmn-js/lib/features/context-pad/ContextPadProvider', () => {})

jest.mock('min-dash', () => {
  return {
    bind: jest.fn().mockImplementation(() => jest.fn().mockReturnValue({
      'delete': jest.fn(),
      'replace': jest.fn(),
      'append.end-event': jest.fn(),
      'append.task': jest.fn(),
      'append.gateway': jest.fn()
    }))
  }
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Context Pad', () => {
        describe('CustomContextPadProvider', () => {
          const eventBus = {
            fire: jest.fn()
          }
          const injector = {
            invoke: jest.fn(),
            get: jest.fn().mockReturnValue(eventBus)
          }
          it('can be instantiated', () => {
            expect(CustomContextPadProvider).toEqual(expect.any(Function))
            CustomContextPadProvider.call({}, injector)
            expect(injector.invoke).toHaveBeenCalled()
          })

          it('overrides the getContextPadEntries function', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            expect(ccpp.getContextPadEntries).toEqual(expect.any(Function))
          })

          it('removes the append.end-event option', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            const entries = ccpp.getContextPadEntries({})
            expect(Object.keys(entries)).not.toContain('append.end-event')
          })

          it('removes the delete and replace option for start events', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            const entries = ccpp.getContextPadEntries({
              type: 'bpmn:StartEvent'
            })
            expect(Object.keys(entries)).not.toContain('append.end-event')
            expect(Object.keys(entries)).not.toContain('delete')
            expect(Object.keys(entries)).not.toContain('remove')
          })

          it('removes the delete and replace option for end events', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            const entries = ccpp.getContextPadEntries({
              type: 'bpmn:EndEvent'
            })
            expect(Object.keys(entries)).not.toContain('append.end-event')
            expect(Object.keys(entries)).not.toContain('delete')
            expect(Object.keys(entries)).not.toContain('remove')
          })

          it('replaces the replace option for extension Areas', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            const obj = {
              id: 1,
              name: 'EA 1'
            }
            const entries = ccpp.getContextPadEntries({
              type: 'cape:ExtensionArea',
              businessObject: obj
            })
            expect(Object.keys(entries)).toContain('replace')
            const option = entries['replace']
            expect(option).toEqual(expect.any(Object))
            expect(option.action).toEqual({ click: expect.any(Function) })
            option.action.click()

            expect(eventBus.fire).toHaveBeenCalledWith('extensionAreaEdit', obj)
          })

          it('keeps all the other options', () => {
            const ccpp = CustomContextPadProvider.call({}, injector)
            const entries = ccpp.getContextPadEntries({})
            expect(Object.keys(entries)).toContain('delete')
            expect(Object.keys(entries)).toContain('replace')
            expect(Object.keys(entries)).toContain('append.task')
            expect(Object.keys(entries)).toContain('append.gateway')
          })
        })
      })
    })
  })
})
