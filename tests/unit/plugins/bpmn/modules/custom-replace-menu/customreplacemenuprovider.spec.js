import CustomReplaceMenuProvider from '@/plugins/bpmn/modules/custom-replace-menu/customReplaceMenuProvider'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('bpmn-js/lib/features/popup-menu/ReplaceMenuProvider', () => {})

jest.mock('min-dash', () => {
  return {
    bind: jest.fn().mockImplementation(() => jest.fn().mockReturnValue([{
      id: 'replace-with-none-task'
    }, {
      id: 'replace-with-none-start'
    }, {
      id: 'replace-with-none-end'
    }, {
      id: 'replace-with-none-gateway'
    }, {
      id: 'replace-with-none-subtask'
    }]))
  }
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Replace Menu', () => {
        describe('CustomReplaceMenuProvider', () => {
          const injector = {
            invoke: jest.fn()
          }
          it('can be instantiated', () => {
            expect(CustomReplaceMenuProvider).toEqual(expect.any(Function))
            CustomReplaceMenuProvider.call({}, injector)
            expect(injector.invoke).toHaveBeenCalled()
          })

          it('removes the replace-with-none-start option', () => {
            const crmp = CustomReplaceMenuProvider.call({}, injector)
            const entries = crmp.getEntries({}).map(e => e.id)
            expect(entries).not.toContain('replace-with-none-start')
          })

          it('removes the replace-with-none-end option', () => {
            const crmp = CustomReplaceMenuProvider.call({}, injector)
            const entries = crmp.getEntries({}).map(e => e.id)
            expect(entries).not.toContain('replace-with-none-end')
          })

          it('keeps all the other options', () => {
            const crmp = CustomReplaceMenuProvider.call({}, injector)
            const entries = crmp.getEntries({}).map(e => e.id)
            expect(entries).toContain('replace-with-none-task')
            expect(entries).toContain('replace-with-none-gateway')
            expect(entries).toContain('replace-with-none-subtask')
          })
        })
      })
    })
  })
})
