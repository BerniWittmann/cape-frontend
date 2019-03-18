describe('Graph Visualization', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/')
  })
  it('renders the graph', () => {
    cy.get('#graph').get('svg')
  })

  it('renders the nodes and edges', () => {
    cy.get('.node.process').should('have.length', 4)
    cy.get('.node.situation').should('have.length', 1)
    cy.get('.node.factor').should('have.length', 7)
    cy.get('.edgePath.process_situation').should('have.length', 1)
    cy.get('.edgePath.situation_factor').should('have.length', 1)
  })

  it('can highlight the edges', () => {
    cy.get('.node.process').eq(1).trigger('mouseover')
    cy.get('.edgePath.active').should('have.length', 1)
    cy.get('.edgePath.inactive').should('have.length', 1)
  })

  describe('can navigate to entities', () => {
    it('can navigate to processes', () => {
      cy.get('.node.process').first().click()
      cy.url().should('contain', 'processes')
      cy.url().should('contain', 'preview')
      cy.get('.el-dialog__header').contains('Order Food')
    })

    it('can navigate to context situations', () => {
      cy.get('.node.situation').first().click()
      cy.url().should('contain', 'context_situations')
      const card = cy.get('.el-card.is-active')
      card.should(($div) => {
        const text = $div.text()

        expect(text).to.include('THE LAW')
      })
    })

    it('can navigate to context factors', () => {
      cy.get('.node.factor').first().click()
      cy.url().should('contain', 'context_factors')
      cy.url().should('contain', 'edit')
      cy.get('.el-dialog__title').contains('Pizza Donald')
    })
  })
})
