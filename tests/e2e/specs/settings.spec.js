describe('Settings Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  it('Shows the available Tags', () => {
    cy.visit('/settings')
    cy.get('.el-col-8 > :nth-child(1) > .el-col').should(($div) => {
      const text = $div.text()

      expect(text).to.include('Delivery')
      expect(text).to.include('Payment')
      expect(text).to.include('Kitchen')
    })
  })
  it('Can add a tag', () => {
    cy.visit('/settings')
    cy.get('.el-col-8 > .el-form > :nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('My new Tag')
    cy.get('.el-color-picker__icon').click()
    cy.get('.el-color-dropdown__value > .el-input > .el-input__inner').type('{selectall}{backspace}#FF0000')
    cy.get('.el-color-dropdown__btn').click()
    cy.get('.el-col-8 > .el-form > :nth-child(3) > .el-form-item__content > .el-button--success').click()
    const tag = cy.get('.el-col-8 > :nth-child(1) > .el-col > :nth-child(4)')
    tag.should('have.text', 'My new Tag')
    tag.should('have.css', 'color').and('match', /rgb\(255, 0, 0\)/)
  })
  it('Can delete a tag', () => {
    cy.visit('/settings')
    cy.get('.el-col-8 > :nth-child(1) > .el-col > :nth-child(2) > .el-tag__close').click()
    cy.wait(300)
    cy.get('.el-col-8 > :nth-child(1) > .el-col > *').should('have.length', 3)
    cy.get('.el-col-8 > :nth-child(1) > .el-col').should(($div) => {
      const text = $div.text()

      expect(text).to.include('Delivery')
      expect(text).not.to.include('Payment')
      expect(text).to.include('Kitchen')
      expect(text).to.include('My new Tag')
    })
  })
  it('can disable the custom rules for the process modeler', () => {
    cy.visit('/settings')
    cy.get('#tab-2').click()
    cy.get('.el-checkbox').click()
    cy.visit('/processes')
    cy.get(':nth-child(1) > .el-table_1_column_5 > .cell > .el-button').click()
    cy.get('[data-group="collaboration"] > .entry').should('exist')
    cy.visit('/settings')
    cy.get('#tab-2').click()
    cy.get('.el-checkbox').click()
    cy.visit('/processes')
    cy.get(':nth-child(1) > .el-table_1_column_5 > .cell > .el-button').click()
    cy.get('[data-group="collaboration"] > .entry').should('not.exist')
  })
})
