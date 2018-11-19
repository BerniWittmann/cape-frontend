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
    cy.get('.el-form-item__content > .el-input > .el-input__inner').type('My new Tag')
    cy.get('.el-color-picker__icon').click()
    cy.get('.el-color-dropdown__value > .el-input > .el-input__inner').type('{selectall}{backspace}#FF0000')
    cy.get('.el-color-dropdown__btn').click()
    cy.get('.el-button--primary').click()
    const tag = cy.get(':nth-child(1) > .el-col > :nth-child(4)')
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
})
