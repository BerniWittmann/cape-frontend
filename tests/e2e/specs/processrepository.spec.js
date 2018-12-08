describe('Process Repository Overview', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/processes')
  })
  it('Shows the Process Table', () => {
    cy.get('.el-main').find('.el-table')
  })
  it('Shows the rendered Processes', () => {
    cy.get('.el-main').find('.el-table').find('.el-table__row').should('have.length', 4)
  })
  it('Can sort the Processes', () => {
    cy.get('.el-table_1_column_1 > .cell > .caret-wrapper > .descending').click()
    cy.get('.el-table__row').eq(0).contains('Pay Pizza bill')
    cy.get('.el-table__row').eq(1).contains('Order Food')
    cy.get('.el-table__row').eq(2).contains('Eat Pizza')
    cy.get('.el-table__row').eq(3).contains('Call Delivery Service')

    cy.get('.el-table_1_column_2 > .cell > .caret-wrapper > .ascending').click()
    cy.get('.el-table__row').eq(0).contains('Eat Pizza')
    cy.get('.el-table__row').eq(1).contains('Order Food')
    cy.get('.el-table__row').eq(2).contains('Pay Pizza bill')
    cy.get('.el-table__row').eq(3).contains('Call Delivery Service')
  })
  it('Can Search for a process by name', () => {
    cy.get('.el-main').find('input').eq(1).type('Pizza')

    const rows = cy.get('.el-main').find('.el-table').find('.el-table__row')
    rows.should('have.length', 2)
    cy.get('.el-table__row').eq(0).contains('Eat Pizza')
    cy.get('.el-table__row').eq(1).contains('Pay Pizza bill')
  })
  it('Can filter for a process by tag', () => {
    cy.get('.el-table__column-filter-trigger').click()
    cy.get('.el-checkbox-group > :nth-child(1)').click()
    cy.get('.el-table-filter__bottom > :nth-child(1)').click()

    const rows = cy.get('.el-main').find('.el-table').find('.el-table__row')
    rows.should('have.length', 2)
    cy.get('.el-table__row').eq(0).contains('Call Delivery Service')
    cy.get('.el-table__row').eq(1).contains('Order Food')
  })
  it('can import a process', () => {
    cy.get('.el-upload').find('input')
  })
})
