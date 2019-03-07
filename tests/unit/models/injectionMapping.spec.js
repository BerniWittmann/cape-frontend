import moment from 'moment'
import ContextSituation from '@/models/contextSituation'
import Process from '@/models/process'
import InjectionMapping from '@/models/injectionMapping'

describe('Models', () => {
  describe('Injection Mapping', () => {
    const date = moment()

    it('has a create Method', () => {
      expect(InjectionMapping.create).toEqual(expect.any(Function))
    })

    it('can create the InjectionMapping Object from the constructor', () => {
      const p = new InjectionMapping({
        _id: '42',
        process_id: '99',
        extension_area_id: 'Extension_Area_0',
        injected_process: {
          _id: '98',
          name: 'My Other Process Fragment',
          created_at: date.clone().subtract(2, 'days').toISOString(),
          last_edited_at: date.clone().subtract(1, 'days').toISOString()
        },
        context_situation: {
          _id: '999',
          name: 'My Context Situation'
        }
      })
      expect(p.id).toEqual('42')
      expect(p.processID).toEqual('99')
      expect(p.extensionAreaID).toEqual('Extension_Area_0')
      expect(p.injectedProcess).toEqual(new Process({
        _id: '98',
        name: 'My Other Process Fragment',
        created_at: date.clone().subtract(2, 'days').toISOString(),
        last_edited_at: date.clone().subtract(1, 'days').toISOString()
      }))
      expect(p.contextSituation).toEqual(new ContextSituation({
        _id: '999',
        name: 'My Context Situation'
      }))
    })

    it('can create the InjectionMapping Object from the create Method', () => {
      const p = InjectionMapping.create({
        _id: '42',
        processID: '99',
        extensionAreaID: 'Extension_Area_0',
        injectedProcess: {
          _id: '98',
          name: 'My Other Process Fragment',
          createdAt: date.clone().subtract(2, 'days').toISOString(),
          lastEditedAt: date.clone().subtract(1, 'days').toISOString()
        },
        contextSituation: {
          _id: '999',
          name: 'My Context Situation'
        }
      })
      expect(p.id).toEqual('42')
      expect(p.processID).toEqual('99')
      expect(p.extensionAreaID).toEqual('Extension_Area_0')
      expect(p.injectedProcess).toEqual(new Process({
        _id: '98',
        name: 'My Other Process Fragment',
        created_at: date.clone().subtract(2, 'days').toISOString(),
        last_edited_at: date.clone().subtract(1, 'days').toISOString()
      }))
      expect(p.contextSituation).toEqual(new ContextSituation({
        _id: '999',
        name: 'My Context Situation'
      }))
    })

    it('defaults to undefined for an undefined injected process', () => {
      const p = new InjectionMapping({
        _id: '42',
        process_id: '99',
        extension_area_id: 'Extension_Area_0',
        injected_process: undefined,
        context_situation: {
          _id: '999',
          name: 'My Context Situation'
        }
      })
      expect(p.id).toEqual('42')
      expect(p.injectedProcess).toEqual(undefined)
      expect(p.toJSON().injected_process).toEqual(undefined)
    })
    it('defaults to undefined for an undefined context situation', () => {
      const p = new InjectionMapping({
        _id: '42',
        process_id: '99',
        extension_area_id: 'Extension_Area_0',
        injected_process: {
          _id: '98',
          name: 'My Other Process Fragment',
          created_at: date.clone().subtract(2, 'days').toISOString(),
          last_edited_at: date.clone().subtract(1, 'days').toISOString()
        },
        context_situation: undefined
      })
      expect(p.id).toEqual('42')
      expect(p.contextSituation).toEqual(undefined)
      expect(p.toJSON().context_situation).toEqual(undefined)
    })

    it('has a toJSON Method', () => {
      const p = new InjectionMapping({
        _id: '42',
        process_id: '99',
        extension_area_id: 'Extension_Area_0',
        injected_process: {
          _id: '98',
          name: 'My Other Process Fragment',
          created_at: date.clone().subtract(2, 'days').toISOString(),
          last_edited_at: date.clone().subtract(1, 'days').toISOString()
        },
        context_situation: {
          _id: '999',
          name: 'My Context Situation'
        }
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        process_id: '99',
        extension_area_id: 'Extension_Area_0',
        injected_process: {
          _id: '98',
          name: 'My Other Process Fragment',
          description: undefined,
          svg: undefined,
          xml: undefined,
          tags: []
        },
        context_situation: {
          _id: '999',
          name: 'My Context Situation',
          rules: undefined,
          tags: []
        }
      })
    })
  })
})
