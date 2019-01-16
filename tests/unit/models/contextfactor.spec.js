import ContextFactor from '@/models/contextFactor'
import ContextAttribute from '@/models/contextAttribute'
import ContextType from '@/models/contextType'

describe('Models', () => {
  describe('Context Factor', () => {
    it('has a create Method', () => {
      expect(ContextFactor.create).toEqual(expect.any(Function))
    })

    it('can create the Context Factor Object from the constructor', () => {
      const p = new ContextFactor({
        _id: '42',
        name: 'My ContextFactor',
        parentID: '19'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextFactor')
      expect(p.parentID).toEqual('19')
    })

    it('can create the Context Factor Object from the create Method', () => {
      const p = ContextFactor.create({
        _id: '42',
        name: 'My ContextFactor',
        parentId: '19'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextFactor')
      expect(p.parentID).toEqual(undefined)
    })

    it('can have multiple ContextAttributes', () => {
      const p = new ContextFactor({
        _id: '42',
        name: 'My ContextFactor',
        attributes: [{
          _id: '1',
          key: 'foo',
          value: 'bar'
        }, {
          _id: '2',
          key: 'other',
          value: 'attr'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextFactor')
      expect(p.parentID).toEqual(undefined)
      expect(p.attributes).toEqual([
        new ContextAttribute({
          _id: '1',
          key: 'foo',
          value: 'bar'
        }),
        new ContextAttribute({
          _id: '2',
          key: 'other',
          value: 'attr'
        })
      ])
      expect(p.toJSON().attributes).toEqual([{
        _id: '1',
        key: 'foo',
        value: 'bar'
      }, {
        _id: '2',
        key: 'other',
        value: 'attr'
      }])
    })

    it('can have a ContextType', () => {
      const p = new ContextFactor({
        _id: '42',
        name: 'My ContextFactor',
        context_type: {
          _id: '42',
          name: 'My ContextType',
          icon: 'fa-heart'
        }
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextFactor')
      expect(p.parentID).toEqual(undefined)
      expect(p.contextType).toEqual(
        new ContextType({
          _id: '42',
          name: 'My ContextType',
          icon: 'fa-heart'
        })
      )
      expect(p.toJSON().context_type).toEqual({
        _id: '42',
        name: 'My ContextType',
        icon: 'fa-heart'
      })
    })

    it('has a toJSON Method', () => {
      const p = new ContextFactor({
        _id: '42',
        name: 'My ContextFactor',
        parentID: '19'
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        name: 'My ContextFactor',
        parentID: '19',
        attributes: [],
        context_factor: undefined
      })
    })
  })
})
