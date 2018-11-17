describe('Process Repository Overview', () => {
  before(() => {
    cy.setupSampleData()
  })
  it('Shows the Process Table', () => {
    cy.visit('/processes')
    cy.get('.el-main').find('.el-table')
  })
  it('Shows the rendered Processes', () => {
    cy.visit('/processes')
    cy.get('.el-main').find('.el-table').find('.el-table__row').should('have.length.above', 0)
  })
})
