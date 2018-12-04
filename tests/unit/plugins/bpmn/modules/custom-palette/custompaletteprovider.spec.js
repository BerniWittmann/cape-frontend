import CustomPaletteProvider from '@/plugins/bpmn/modules/custom-palette/customPaletteProvider'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('bpmn-js/lib/features/palette/PaletteProvider', () => {})

jest.mock('min-dash', () => {
  return {
    bind: jest.fn().mockImplementation(() => jest.fn().mockReturnValue({
      'create.connection': jest.fn(),
      'create.start-event': jest.fn(),
      'create.end-event': jest.fn(),
      'create.task': jest.fn(),
      'create.gateway': jest.fn()
    }))
  }
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Palette', () => {
        describe('CustomPaletteProvider', () => {
          const injector = {
            invoke: jest.fn()
          }
          it('can be instantiated', () => {
            expect(CustomPaletteProvider).toEqual(expect.any(Function))
            CustomPaletteProvider.call({}, injector)
            expect(injector.invoke).toHaveBeenCalled()
          })

          it('removes the create.start-event option', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            expect(Object.keys(entries)).not.toContain('create.start-event')
          })

          it('removes the create.end-event option', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            expect(Object.keys(entries)).not.toContain('create.end-event')
          })

          it('keeps all the other options', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            expect(Object.keys(entries)).toContain('create.connection')
            expect(Object.keys(entries)).toContain('create.task')
            expect(Object.keys(entries)).toContain('create.gateway')
          })
        })
      })
    })
  })
})
