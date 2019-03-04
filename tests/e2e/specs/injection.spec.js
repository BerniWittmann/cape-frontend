describe('Process Injection', () => {
  beforeEach(() => {
    cy.setupSampleData()
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.eq(1).click({ force: true })
    cy.url().should('contain', 'edit')
    cy.get(':nth-child(9) > .djs-element > .djs-hit').click()
    cy.get('.bpmn-icon-screw-wrench').click()
    cy.get('.el-dialog')
    cy.url().should('contain', 'extension-area')
    cy.url().should('contain', 'ExtensionArea_000000')
  })
  it('can open the extension Area Dialog', () => {
    cy.get('.el-dialog__header').should('have.text', 'Call EA')
  })
})
