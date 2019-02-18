describe('Context Situations Page', () => {
  before(() => {
    cy.setupSampleData()
  })
  beforeEach(() => {
    cy.visit('/context_situations')
  })
  it('renders the context situations', () => {
    const cards = cy.get('.el-card')

    cards.should('have.length', 1)
  })

  it('shows active card', () => {
    const card = cy.get('.el-card')
    card.click()

    card.should('have.class', 'is-active')
    card.should(($div) => {
      const text = $div.text()

      expect(text).to.include('Eat Pizza')
    })
  })

  it('can edit the name', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.clearfix > .input-edit > .el-button > .el-icon-edit').click()
    cy.get('.input > .el-input__inner').type('{selectall}{backspace}New Name')
    cy.get('.el-button--success').click()
    cy.get('.el-card').should(($div) => {
      const text = $div.text()
      expect(text).to.include('Eat Pizza')
    })
    cy.get('.el-notification').contains('Success')
  })

  it('can update the rules', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.el-card__body .input-edit > .el-button > .el-icon-edit').click()
    cy.get('.input > .el-input__inner').type('{selectall}{backspace}New Rules')
    cy.get('.el-button--success').click()
    cy.wait(500)

    cy.get('.el-notification').contains('Success')
    cy.get('.el-card').click()
    cy.get('.el-card__body .input-edit').contains('New Rules')
  })

  it('can add a tag', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.tags > div > .el-button').click()
    cy.wait(200)
    cy.get(':nth-child(2) > .el-select > .el-input > .el-input__inner').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1)').click()

    const tags = cy.get('.el-tag__close')
    tags.should('have.length', 3)
  })

  it('can remove a tag', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.el-tag__close').first().click()
    const tags = cy.get('.el-tag__close')
    tags.should('have.length', 1)
  })

  it('can reset the process', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.el-card__body .input-edit > .el-button > .el-icon-edit').click()
    cy.get('.input > .el-input__inner').type('{selectall}{backspace}New Rules')

    cy.get('.el-button--danger').first().click()
    cy.wait(200)
    cy.get('.el-card__body .input-edit').contains('New Rules')
  })

  it('can add a context situation', () => {
    cy.get('.el-form-item__content > .el-input > .el-input__inner').type('{selectall}{backspace}New Context Situation')
    cy.get('.el-form > .el-button').click()
    cy.get('.el-notification').contains('Success')
    cy.get('.el-card').should('have.length', 2)
    cy.get('.is-always-shadow > .el-card__header > .clearfix > .input-edit > span').contains('New Context Situation')
  })

  it('can remove a context situation', () => {
    cy.get('.el-card').first().click()
    cy.get('.el-button--danger').eq(1).click()
    cy.get('.el-button--primary').click()
    cy.get('.el-card').should('have.length', 1)
  })
})
