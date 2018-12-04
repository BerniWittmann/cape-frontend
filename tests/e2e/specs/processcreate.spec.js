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
    cy.get('.process-edit__title').contains('New Name')
  })
  it('can add a tag', () => {
    cy.get('.el-form-item__content > .el-button').click()
    cy.wait(200)
    cy.get('.el-form-item__content > .el-select').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1)').click()

    const tags = cy.get('.el-form-item__content > .el-tag')
    tags.should('have.length', 1)
    tags.contains('Delivery')
  })
  it('can remove a tag', () => {
    cy.get('.el-form-item__content > .el-button').click()
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
  it('can model the process', () => {
    cy.get('#app').scrollTo('top')
    cy.get('.djs-palette-entries')

    cy.get(':nth-child(2) > .djs-element > .djs-hit').click()
    cy.get('[data-group="model"] > .bpmn-icon-task').click()
    cy.get('.djs-direct-editing-content').type('Do that')
    cy.get('[data-group="model"] > .bpmn-icon-intermediate-event-none').click()

    cy.get('.el-input__inner').type('My modelled Process')
    cy.get('.el-button--success').click()
    cy.url().should('contain', 'edit')
    cy.wait(300)

    cy.reload()
    cy.get(':nth-child(6) > .djs-element .djs-label').contains('Do that')
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
