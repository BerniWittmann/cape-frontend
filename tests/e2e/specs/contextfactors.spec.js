describe('Context Factors Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/context_factors')
  })
  it('renders the title', () => {
    cy.get('h3').contains('Context Factors')
  })
  it('renders the tree', () => {
    cy.get('.el-tree')
    cy.get('[style="padding-left: 0px;"] > .custom-tree-node > :nth-child(2)').contains('Pizza Donalds')
  })
  it('can collapse nodes', () => {
    cy.get('.el-tree').contains('Temperature Sensor')
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1) > .el-tree-node__content > .custom-tree-node > :nth-child(2)').should('be.visible')
    cy.get('[style="padding-left: 18px;"] > .expanded').click()
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1) > .el-tree-node__content > .custom-tree-node > :nth-child(2)').should('not.be.visible')
  })
  it('can filter the context factors', () => {
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1) > .el-tree-node__content > .custom-tree-node > :nth-child(2)').should('be.visible')
    cy.get('.el-input__inner').type('Do')
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1) > .el-tree-node__content > .custom-tree-node > :nth-child(2)').should('not.be.visible')
  })
  it('can edit a context factor', () => {
    cy.get('[style="padding-left: 0px;"] > .custom-tree-node > .align-right > .el-button > span').click()
    cy.url().should('contain', Cypress.config().baseUrl + '/context_factors/')
    cy.url().should('contain', 'edit')
    cy.get('.el-form-item__content > .el-input > .el-input__inner').type(' new')
    cy.get('.el-form > .el-button').click()
    cy.get('.el-form--label-left > .el-form > :nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('Foo')
    cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__inner').type('Bar')
    cy.get('.el-select > .el-input > .el-input__inner').click()
    cy.get('.el-scrollbar__view > :nth-child(2) > span').click()
    cy.get('.el-button--success').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/context_factors')
    cy.get('[style="padding-left: 0px;"] > .custom-tree-node > :nth-child(2)').contains('Pizza Donalds new')
    cy.get('[style="padding-left: 0px;"] > .custom-tree-node > .fa').should('have.class', 'fa-thermometer-full')
  })
})
