import CustomPaletteProvider from '@/plugins/bpmn/modules/custom-palette/customPaletteProvider'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('bpmn-js/lib/features/palette/PaletteProvider', () => {
})

jest.mock('min-dash', () => {
  return {
    bind: jest.fn().mockImplementation(() => jest.fn().mockReturnValue({
      'create.connection': jest.fn(),
      'create.start-event': jest.fn(),
      'create.end-event': jest.fn(),
      'create.task': jest.fn(),
      'create.gateway': jest.fn(),
      'create.subprocess-expanded': {
        type: 'bpmn:SubProcess',
        action: {}
      }
    })),
    assign: jest.fn().mockImplementation((obj, options) => ({
      di: {},
      ...obj,
      options
    }))
  }
})

const elementFactory = {
  createShape: jest.fn().mockImplementation(obj => {
    return {
      businessObject: obj,
      isShape: true
    }
  })
}

const create = {
  start: jest.fn().mockImplementation((event, shape) => {
  })
}

const translate = jest.fn().mockImplementation(arg => 'translated: ' + arg)

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Palette', () => {
        describe('CustomPaletteProvider', () => {
          const injector = {
            invoke: jest.fn(),
            get: jest.fn().mockImplementation(arg => {
              switch (arg) {
                case 'elementFactory':
                  return elementFactory
                case 'translate':
                  return translate
                case 'create':
                  return create
                default:
                  throw new Error('Injector could not find ' + arg)
              }
            })
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

          it('removes the create.subprocess-expanded option', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            expect(Object.keys(entries)).not.toContain('create.subprocess-expanded')
          })

          it('adds the create.subprocess-collapsed option', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            const option = entries['create.subprocess-collapsed']
            expect(option).not.toBeFalsy()
            expect(option).toEqual({
              type: 'bpmn:SubProcess',
              className: 'bpmn-icon-subprocess-collapsed',
              title: 'translated: Create collapsed SubProcess',
              action: option.action
            })
            expect(option.action.click).toEqual(expect.any(Function))
            expect(option.action.dragstart).toEqual(expect.any(Function))
            expect(option.action.click).toEqual(option.action.dragstart)

            const event = { event: true, foo: 'bar' }
            option.action.click(event)

            expect(create.start).toHaveBeenCalledWith(event, {
              isShape: true,
              businessObject: {
                type: 'bpmn:SubProcess',
                di: {
                  isExpanded: false
                },
                options: { isExpanded: false }
              }
            })
          })

          it('adds the create.extension-area option', () => {
            const cpp = CustomPaletteProvider.call({}, injector)
            const entries = cpp.getPaletteEntries({})
            const option = entries['create.extension-area']
            expect(option).not.toBeFalsy()
            expect(option).toEqual({
              group: 'custom',
              className: 'bpmn-icon-extension-area',
              title: 'translated: Create Extension Area',
              action: option.action
            })
            expect(option.action.click).toEqual(expect.any(Function))
            expect(option.action.dragstart).toEqual(expect.any(Function))
            expect(option.action.click).toEqual(option.action.dragstart)

            const event = { event: true, foo: 'bar' }
            option.action.click(event)

            expect(create.start).toHaveBeenCalledWith(event, {
              isShape: true,
              businessObject: {
                type: 'cape:ExtensionArea',
                di: {}
              }
            })
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
