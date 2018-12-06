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
  it('renders the svg', () => {
    cy.get('.svg-view').should('have.attr', 'srcdoc')
  })
  it('can navigate back', () => {
    cy.get('.el-dialog__close').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/processes')
  })
  it('can navigate to edit page', () => {
    cy.get('.el-col > .el-button').eq(0).click()
    cy.url().should('contain', Cypress.config().baseUrl + '/processes/')
    cy.url().should('contain', 'edit')
  })
  it('can delete a process', () => {
    cy.get('.el-col > .el-button').eq(1).click()
    cy.get('.el-message-box .el-button--danger').click()

    cy.get('.el-message').contains('Process deleted')
    cy.url().should('eq', Cypress.config().baseUrl + '/processes')
    cy.wait(200)

    const rows = cy.get('.el-main').find('.el-table').find('.el-table__row')
    rows.should('have.length', 3)
    cy.get('.el-table__row').eq(0).contains('Eat Pizza')
    cy.get('.el-table__row').eq(1).contains('Order Food')
    cy.get('.el-table__row').eq(2).contains('Pay Pizza bill')
  })
})
