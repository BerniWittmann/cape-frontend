describe('Settings Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  it('Shows the available tags', () => {
    cy.visit('/settings')
    cy.get(':nth-child(1) > .el-table_1_column_1 > .cell > .tag').should('have.text', 'Delivery')
    cy.get(':nth-child(2) > .el-table_1_column_1 > .cell > .tag').should('have.text', 'Payment')
    cy.get(':nth-child(3) > .el-table_1_column_1 > .cell > .tag').should('have.text', 'Kitchen')
  })

  it('Can add a tag', () => {
    cy.visit('/settings')
    cy.get('#pane-0 > .el-container > .el-main > .el-form > :nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('My new Tag')
    cy.get('.el-color-picker__icon').click()
    cy.get('.el-color-dropdown__value > .el-input > .el-input__inner').type('{selectall}{backspace}#FF0000')
    cy.get('.el-color-dropdown__btn').click()
    cy.get('#pane-0 > .el-container > .el-main > .el-form > :nth-child(3) > .el-form-item__content > .el-button--success').click()
    const tag = cy.get(':nth-child(4) > .el-table_1_column_1 > .cell > .tag')
    tag.should('have.text', 'My new Tag')
    tag.should('have.css', 'color').and('match', /rgb\(255, 0, 0\)/)
  })

  it('Can delete a tag', () => {
    cy.visit('/settings')
    cy.get('#pane-0 > .el-container > .el-aside > .el-switch > .el-switch__core').click()
    cy.get(':nth-child(2) > .el-table_1_column_1 > .cell > .tag > .el-tag__close').click()
    cy.wait(300)
    cy.get('#pane-0 > .el-container > .el-aside > .el-table > .el-table__body-wrapper > .el-table__body > tbody > *').should('have.length', 3)
    cy.get('#pane-0 > .el-container > .el-aside > .el-table > .el-table__body-wrapper > .el-table__body > tbody > *').should(($tr) => {
      const text = $tr.text()

      expect(text).to.include('Delivery')
      expect(text).not.to.include('Payment')
      expect(text).to.include('Kitchen')
      expect(text).to.include('My new Tag')
    })
  })

  it('Shows the available context types', () => {
    cy.visit('/settings')
    cy.get('#tab-1').click()

    cy.get(':nth-child(1) > .el-table_2_column_2 > .cell > .context-type').should(($span) => {
      const text = $span.text()
      expect(text).to.include('Motor')
    })
    cy.get(':nth-child(1) > .el-table_2_column_2 > .cell > .context-type > .tag > i').should('have.class', 'fa-gear')

    cy.get(':nth-child(2) > .el-table_2_column_2 > .cell > .context-type').should(($span) => {
      const text = $span.text()
      expect(text).to.include('Sensor')
    })
  })

  it('Can add a context type', () => {
    cy.visit('/settings')
    cy.get('#tab-1').click()

    cy.get('.context-input > .el-form-item__content > .el-input > .el-input__inner').type('My new Context Type')
    cy.get('#context-type-icon').click()
    cy.wait(100)
    cy.get(':nth-child(14)').click()
    cy.get('#pane-1 > .el-container > .el-main > .el-form > :nth-child(3) > .el-form-item__content > .el-button--success').click()
    cy.get(':nth-child(3) > .el-table_2_column_2 > .cell > .context-type').should(($span) => {
      const text = $span.text()
      expect(text).to.include('My new Context Type')
    })
    cy.get(':nth-child(3) > .el-table_2_column_2 > .cell > .context-type > .tag > i').should('have.class', 'fa-remove')
  })

  it('Can delete a context type', () => {
    cy.visit('/settings')
    cy.get('#tab-1').click()

    cy.get('#pane-1 > .el-container > .el-aside > .el-switch > .el-switch__core').click()
    cy.get(':nth-child(3) > .el-table_2_column_2 > .cell > .context-type > .tag > .el-tag__close').click()

    cy.wait(300)

    cy.get('#pane-1 > .el-container > .el-aside > .el-table > .el-table__body-wrapper > .el-table__body > tbody > *').should('have.length', 2)
    cy.get('#pane-1 > .el-container > .el-aside > .el-table > .el-table__body-wrapper > .el-table__body > tbody > *').should(($tr) => {
      const text = $tr.text()
      expect(text).to.include('Motor')
      expect(text).to.include('Sensor')
      expect(text).not.to.include('My new Tag')
    })
  })

  it('can disable the custom rules for the process modeler', () => {
    cy.visit('/settings')
    cy.get('#tab-2').click()
    cy.get('.el-checkbox').click()
    cy.visit('/processes')
    cy.get(':nth-child(1) > .el-table_1_column_5 > .cell > .el-button').click()
    cy.get('[data-group="collaboration"] > .entry').should('exist')
    cy.get('[data-group="custom"] > .entry').should('not.exist')
    cy.visit('/settings')
    cy.get('#tab-2').click()
    cy.get('.el-checkbox').click()
    cy.visit('/processes')
    cy.get(':nth-child(1) > .el-table_1_column_5 > .cell > .el-button').click()
    cy.get('[data-group="collaboration"] > .entry').should('not.exist')
    cy.get('[data-group="custom"] > .entry').should('exist')
  })
})
