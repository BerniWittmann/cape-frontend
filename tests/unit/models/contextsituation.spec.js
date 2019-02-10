import ContextSituation from '@/models/contextSituation'
import Tag from '@/models/tag'

describe('Models', () => {
  describe('Context Situation', () => {
    it('has a create Method', () => {
      expect(ContextSituation.create).toEqual(expect.any(Function))
    })

    it('can create the Context Situation Object from the constructor', () => {
      const p = new ContextSituation({
        _id: '42',
        name: 'My ContextSituation',
        rules: '19',
        tags: [{
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextSituation')
      expect(p.rules).toEqual('19')
      expect(p.tags).toEqual([
        new Tag({
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        })
      ])
    })

    it('can create the Context Factor Object from the create Method', () => {
      const p = ContextSituation.create({
        _id: '42',
        name: 'My ContextSituation',
        rules: '19',
        tags: [{
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextSituation')
      expect(p.rules).toEqual('19')
      expect(p.tags).toEqual([
        new Tag({
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        })
      ])
    })

    it('can have multiple Tags', () => {
      const p = new ContextSituation({
        _id: '42',
        name: 'My ContextSituation',
        rules: '19',
        tags: [{
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        }, {
          _id: '100',
          name: 'My Tag 2',
          color: '#FF00FF'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextSituation')
      expect(p.rules).toEqual('19')
      expect(p.tags).toEqual([
        new Tag({
          _id: '99',
          name: 'My Tag 1',
          color: '#FF0000'
        }),
        new Tag({
          _id: '100',
          name: 'My Tag 2',
          color: '#FF00FF'
        })
      ])
      expect(p.toJSON().tags).toEqual([{
        _id: '99',
        name: 'My Tag 1',
        color: '#FF0000'
      }, {
        _id: '100',
        name: 'My Tag 2',
        color: '#FF00FF'
      }])
    })

    it('has a toJSON Method', () => {
      const p = new ContextSituation({
        _id: '42',
        name: 'My ContextSituation',
        rules: '19',
        tags: []
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        name: 'My ContextSituation',
        rules: '19',
        tags: []
      })
    })
  })
})
