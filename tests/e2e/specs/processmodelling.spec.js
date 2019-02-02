describe('Process Modelling', () => {
  beforeEach(() => {
    cy.setupSampleData()
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.eq(1).click({ force: true })
    cy.url().should('contain', 'edit')
  })
  it('can rename tasks', () => {
    cy.get('.djs-palette-entries')

    cy.get(':nth-child(6) > .djs-element .djs-label').contains('Call')
    cy.get(':nth-child(6) > .djs-element > .djs-hit').dblclick({ force: true })
    cy.get('.djs-direct-editing-content').type('{selectall}{backspace}Call them')
    cy.get('.djs-palette-entries').click()

    cy.get('.el-button--success').click()
    cy.get('.el-notification').contains('Success')
    cy.wait(500)

    cy.reload()
    cy.get(':nth-child(6) > .djs-element .djs-label').contains('Call them')
  })
  it('validates the process', () => {
    cy.get(':nth-child(6) > .djs-element > .djs-hit').click()
    cy.get('[data-group="model"] > .bpmn-icon-task').click()
    cy.get('.el-button--success').click()
    cy.get('.el-message').contains('unconnected entities')
  })
  it('prevents dropping tasks somewhere where they are unconnected', () => {
    cy.get('#app').scrollTo('top')
    cy.get('.bpmn-icon-task').click().trigger('mousemove', { clientX: 300, clientY: 30 }).trigger('mouseup')
    cy.get('.djs-element').should('have.length', 7)
  })
  it('can move objects around', () => {
    cy.get('#app').scrollTo('top')
    cy.get(':nth-child(6) > .djs-element > .djs-hit')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 500, clientY: 200 })
    cy.get('.djs-drag-group').trigger('mouseup', { force: true })
  })
  it('can render extension areas', () => {
    cy.get('[data-group="custom"] > .entry').should('exist')
  })
})
