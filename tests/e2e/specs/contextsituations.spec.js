describe('Context Situations Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/context_situations')
  })
  it('renders the context situations', () => {
    const cards = cy.get('.el-card')

    cards.should('have.length', 1)
  })

  it('shows active card', () => {
    const card = cy.get('.el-card')
    card.click()

    card.should('have.class', 'is-active')
    card.should(($div) => {
      const text = $div.text()

      expect(text).to.include('Eat Pizza')
    })
  })
})
