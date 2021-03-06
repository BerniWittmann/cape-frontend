describe('Process Edit Page', () => {
  before(() => {
    cy.setupSampleData()
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.eq(1).click()
    cy.url().should('contain', 'edit')
  })
  it('can update the name', () => {
    cy.get('.el-icon-edit').click()
    cy.get('.el-input__inner').type('{selectall}{backspace}New Name')
    cy.get('.el-button--success').click()
    cy.get(':nth-child(4) > .title').contains('New Name')
    cy.get('.el-notification').contains('Success')
  })
  it('can update the description', () => {
    cy.get('.el-collapse').click()
    cy.get('.el-textarea__inner').type('New Description')
    cy.get('.el-button--success').click()
    cy.wait(500)

    cy.get('.el-notification').contains('Success')
    cy.get('.el-textarea__inner').should('have.value', 'New Description')
  })
  it('can add a tag', () => {
    cy.get('.el-collapse').click()
    cy.get('.el-collapse-item__content > :nth-child(1) > .el-form-item__content .el-button').click()
    cy.wait(200)
    cy.get('.el-form-item__content .el-select').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1)').click()

    const tags = cy.get('.el-form-item__content .el-tag')
    tags.should('have.length', 2)
    tags.contains('Payment')
  })
  it('can remove a tag', () => {
    cy.get('.el-tag__close').first().click()
    const tags = cy.get('.el-form-item__content .el-tag')
    tags.should('have.length', 1)
    tags.contains('Payment')
  })
  it('can reset the process', () => {
    cy.get('.el-icon-edit').click()
    cy.get('.el-input__inner').type('{selectall}{backspace}Call Delivery Service')
    cy.get('.el-button--success').click()
    cy.get('.el-icon-edit').click()
    cy.get('.el-input__inner').type('{selectall}{backspace}Invalid Name')
    cy.get('.el-button--danger').click()
    cy.wait(200)
    cy.get(':nth-child(4) > .title').contains('Call Delivery Service')
  })
  it('shows the modeler', () => {
    cy.get('.djs-palette-entries')
  })
})
