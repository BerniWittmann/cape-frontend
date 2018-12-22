import ContextType from '@/models/contextType'

describe('Models', () => {
  describe('Context Type', () => {
    it('has a create Method', () => {
      expect(ContextType.create).toEqual(expect.any(Function))
    })

    it('can create the Context Type Object from the constructor', () => {
      const p = new ContextType({
        _id: '42',
        name: 'My ContextType',
        icon: 'fa-heart'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextType')
      expect(p.icon).toEqual('fa-heart')
    })

    it('can create the Context Type Object from the create Method', () => {
      const p = ContextType.create({
        _id: '42',
        name: 'My ContextType',
        icon: 'fa-heart'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My ContextType')
      expect(p.icon).toEqual('fa-heart')
    })

    it('has a toJSON Method', () => {
      const p = new ContextType({
        _id: '42',
        name: 'My ContextType',
        icon: 'fa-heart'
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        name: 'My ContextType',
        icon: 'fa-heart'
      })
    })
  })
})
