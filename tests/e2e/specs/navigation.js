describe('Navigations', () => {
  it('Navigates to the about page', () => {
    cy.visit('/')
    cy.get('.nav').get('a').eq(1).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/about')
    cy.get('.el-main').contains('About the Project')
  })
  it('Navigates to the home page', () => {
    cy.visit('/about')
    cy.get('.nav').get('a').first().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('.el-main').contains('Welcome')
  })
})
