describe('Process Injection', () => {
  beforeEach(() => {
    cy.setupSampleData()
    cy.visit('/processes')
    const buttons = cy.get('.el-main .el-table .el-button')
    buttons.eq(1).click({ force: true })
    cy.get('.process-info')
    cy.url().should('contain', 'edit')
    cy.get(':nth-child(9) > .djs-element > .djs-hit').click()
    cy.get('.bpmn-icon-screw-wrench').click()
    cy.wait(200)
    cy.get('.el-dialog')
    cy.url().should('contain', 'extension-area')
    cy.url().should('contain', 'ExtensionArea_000000')
  })
  it('can open the extension Area Dialog', () => {
    cy.get('.el-dialog__header').should('have.text', 'Call EA')
  })
  it('renders the injection mappings', () => {
    const items = cy.get('.el-dialog .el-collapse-item__header')
    items.should('have.length', 1)
    const item = items.eq(0)
    item.should(($tr) => {
      const text = $tr.text()

      expect(text).to.include('THE LAW')
      expect(text).to.include('Order Food')
    })
    item.click()
    cy.get('.el-dialog :nth-child(2) > .el-form-item__content > .el-cascader > .el-cascader__label').should(($tr) => {
      const text = $tr.text()

      expect(text).to.include('THE LAW')
    })
    cy.get('.el-dialog :nth-child(4) > .el-form-item__content > .el-cascader > .el-cascader__label').should(($tr) => {
      const text = $tr.text()

      expect(text).to.include('Order Food')
    })
  })
  it('can add an injection mapping', () => {
    cy.get('.el-dialog #add').click()
    cy.get('.el-dialog .el-collapse-item__header').should('have.length', 2)
  })
  it('can edit an injection mapping', () => {
    cy.get('.el-dialog .el-collapse-item__header').click()
    cy.get('.el-dialog :nth-child(2) > .el-form-item__content > .el-cascader > .el-cascader__label').click({ force: true })
    cy.get('.el-cascader-menu')
    cy.get('.el-dialog :nth-child(4) > .el-form-item__content > .el-cascader > .el-cascader__label').click({ force: true })
    cy.get('.el-cascader-menu .el-cascader-menu__item').eq(10).click()
    cy.get('.el-dialog .el-button--success').click()
    cy.get('.el-notification').contains('Success')
    cy.reload()
    cy.get('.el-dialog')
    const items = cy.get('.el-dialog .el-collapse-item__header')
    items.should('have.length', 1)
    const item = items.eq(0)
    item.should(($tr) => {
      const text = $tr.text()

      expect(text).to.include('THE LAW')
      expect(text).to.include('Call Delivery Service')
    })
  })
  it('can remove an injection mapping', () => {
    cy.get('.el-dialog .el-collapse-item__header').click()
    cy.get('.el-dialog .el-button--danger').click()
    cy.get('.el-message-box .el-button--primary').click()
    cy.get('.el-message--success')
    cy.reload()
    cy.get('.el-dialog')
    const items = cy.get('.el-dialog .el-collapse-item__header')
    items.should('have.length', 0)
  })
})
