describe('Render', () => {
  before(() => {
    cy.setupSampleData()
  })
  it('Renders the navigation', () => {
    cy.visit('/')
    cy.get('.nav').should('exist')
  })
  it('Renders the footer', () => {
    cy.visit('/')
    cy.get('.footer').should('exist')
  })
})
