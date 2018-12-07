describe('Process Create Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/processes/new')
  })
  it('can update the name', () => {
    cy.get('.el-input__inner').type('New Name')
    cy.get('.el-button--success').click()
    cy.wait(500)

    cy.url().should('contain', 'edit')
    cy.get(':nth-child(4) > .title').contains('New Name')
  })
  it('can update the description', () => {
    cy.get('.el-input__inner').type('New Name')
    cy.get('.el-textarea__inner').type('New Description')
    cy.get('.el-button--success').click()
    cy.wait(500)

    cy.url().should('contain', 'edit')
    cy.get('.el-textarea__inner').should('have.value', 'New Description')
  })
  it('can add a tag', () => {
    cy.get(':nth-child(3) > .el-form-item__content > .el-button').click()
    cy.wait(200)
    cy.get('.el-form-item__content > .el-select').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1)').click()

    const tags = cy.get('.el-form-item__content > .el-tag')
    tags.should('have.length', 1)
    tags.contains('Delivery')
  })
  it('can remove a tag', () => {
    cy.get(':nth-child(3) > .el-form-item__content > .el-button').click()
    cy.wait(200)
    cy.get('.el-form-item__content > .el-select').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1)').click()

    let tags = cy.get('.el-form-item__content > .el-tag')
    tags.should('have.length', 1)

    cy.get('.el-tag__close').first().click()
    tags = cy.get('.el-form-item__content > .el-tag')
    tags.should('have.length', 0)
  })
  it('shows the modeler', () => {
    cy.get('.djs-palette-entries')
  })
  it('the newly created process is shown in the overview', () => {
    cy.get('.el-input__inner').type('My new test Name')
    cy.get('.el-button--success').click()

    cy.url().should('contain', 'edit')
    cy.wait(300)
    cy.visit('/processes')
    cy.get('tbody > :nth-child(1) > .el-table_1_column_1 > .cell').contains('My new test Name')
  })
})
