import ContextAttribute from '@/models/contextAttribute'

describe('Models', () => {
  describe('Context Attribute', () => {
    it('has a create Method', () => {
      expect(ContextAttribute.create).toEqual(expect.any(Function))
    })

    it('can create the Context Attribute Object from the constructor', () => {
      const p = new ContextAttribute({
        _id: '42',
        key: 'foo',
        value: 'bar'
      })
      expect(p.id).toEqual('42')
      expect(p.key).toEqual('foo')
      expect(p.value).toEqual('bar')
    })

    it('can create the Context Attribute Object from the create Method', () => {
      const p = ContextAttribute.create({
        _id: '42',
        key: 'foo',
        value: 'bar'
      })
      expect(p.id).toEqual('42')
      expect(p.key).toEqual('foo')
      expect(p.value).toEqual('bar')
    })

    it('has a toJSON Method', () => {
      const p = new ContextAttribute({
        _id: '42',
        key: 'foo',
        value: 'bar'
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        key: 'foo',
        value: 'bar'
      })
    })
  })
})
