import Tag from '@/models/tag'

describe('Models', () => {
  describe('Tag', () => {
    it('has a create Method', () => {
      expect(Tag.create).toEqual(expect.any(Function))
    })

    it('can create the Tag Object from the constructor', () => {
      const p = new Tag({
        _id: '42',
        name: 'My Tag',
        color: '#FFFF00'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My Tag')
      expect(p.color).toEqual('#FFFF00')
    })

    it('can create the Tag Object from the create Method', () => {
      const p = Tag.create({
        _id: '42',
        name: 'My Tag',
        color: '#FFFF00'
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My Tag')
      expect(p.color).toEqual('#FFFF00')
    })

    it('has a toJSON Method', () => {
      const p = new Tag({
        _id: '42',
        name: 'My Tag',
        color: '#FF0000'
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        name: 'My Tag',
        color: '#FF0000'
      })
    })
  })
})
