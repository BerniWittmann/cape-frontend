import ContextRule from '@/models/contextRule'

describe('Models', () => {
  describe('Context Rule', () => {
    it('has a create Method', () => {
      expect(ContextRule.create).toEqual(expect.any(Function))
    })

    it('can create the Context Rule Object from the constructor', () => {
      const p = new ContextRule({
        _id: '42',
        state: 'foo',
        rule: 'bar'
      })
      expect(p.id).toEqual('42')
      expect(p.state).toEqual('foo')
      expect(p.rule).toEqual('bar')
    })

    it('can create the Context Rule Object from the create Method', () => {
      const p = ContextRule.create({
        _id: '42',
        state: 'foo',
        rule: 'bar'
      })
      expect(p.id).toEqual('42')
      expect(p.state).toEqual('foo')
      expect(p.rule).toEqual('bar')
    })

    it('has a toJSON Method', () => {
      const p = new ContextRule({
        _id: '42',
        state: 'foo',
        rule: 'bar'
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        state: 'foo',
        rule: 'bar'
      })
    })
  })
})
