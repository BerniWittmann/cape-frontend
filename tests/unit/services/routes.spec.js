import getRoute from '@/services/routes'

describe('Routes', () => {
  it('exports the getRoute method', () => {
    expect(getRoute).toEqual(expect.any(Function))
  })

  it('returns the routes', () => {
    expect(getRoute('processes.all')).toEqual('/processes')
    expect(getRoute('tags.all')).toEqual('/tags')
  })

  it('replaces the ids', () => {
    expect(getRoute('processes.single', [12])).toEqual('/processes/12')
    expect(getRoute('processes.tags', [12])).toEqual('/processes/12/tags')
    expect(getRoute('tags.single', [99])).toEqual('/tags/99')
  })

  it('replaces the ids from objects', () => {
    expect(getRoute('processes.single', [{ id: 12 }])).toEqual('/processes/12')
    expect(getRoute('processes.tags', [{ id: 12 }])).toEqual('/processes/12/tags')
    expect(getRoute('tags.single', [{ id: 99 }])).toEqual('/tags/99')
  })
})
