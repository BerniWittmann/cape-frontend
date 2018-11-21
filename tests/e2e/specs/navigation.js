describe('Navigations', () => {
  before(() => {
    cy.setupSampleData()
  })
  it('Navigates to the about page', () => {
    cy.visit('/')
    cy.get('.footer a').first().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/about')
    cy.get('.el-main').contains('About the Project')
  })
  it('Navigates to the process Repository page', () => {
    cy.visit('/')
    cy.get('.nav .el-menu-item').first().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/processes/')
  })
  it('Navigates to the home page', () => {
    cy.visit('/about')
    cy.get('.nav').get('a').first().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('.el-main').contains('Welcome')
  })
  it('Navigates to the settings page', () => {
    cy.visit('/')
    cy.get('.footer a').eq(1).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/settings')
    cy.get('.el-main').contains('Settings')
  })
  it('Navigates to the process Edit page', () => {
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.should('have.length', 4)
    buttons.eq(1).click()
    cy.url().should('contain', Cypress.config().baseUrl + '/processes/')
    cy.url().should('contain', 'edit')
  })
  it('Navigates back process Edit page', () => {
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.eq(1).click()
    cy.get('.process-edit__title > .el-button').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/processes')
  })
})
