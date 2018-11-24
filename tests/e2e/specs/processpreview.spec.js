describe('Process Preview Page', () => {
  function openPreview() {
    cy.visit('/processes')
    cy.get(':nth-child(2) > .el-table_1_column_1 > .cell').click()
    cy.url().should('contain', 'preview')
  }
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    openPreview()
  })
  it('renders the name', () => {
    cy.get('.el-dialog__header').contains('Call Delivery Service')
  })
  it('renders the tags', () => {
    cy.get('.el-col > .tag').contains('Delivery')
  })
  it('can navigate back', () => {
    cy.get('.el-dialog__close').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/processes')
  })
  it('can navigate to edit page', () => {
    cy.get('.el-col > .el-button').click()
    cy.url().should('contain', Cypress.config().baseUrl + '/processes/')
    cy.url().should('contain', 'edit')
  })
})
