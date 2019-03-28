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

      expect(text).to.include('Occurrence Rule')
    })
  })

  it('can edit the name', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.clearfix > .input-edit > .el-button > .el-icon-edit').click()
    cy.get('.input > .el-input__inner').type('{selectall}{backspace}New Name').trigger('blur')
    cy.get(':nth-child(3) > .el-button--success').click()
    cy.get('.el-card').should(($div) => {
      const text = $div.text()
      expect(text).to.include('New Name')
    })
    cy.get('.el-notification').contains('Success')
  })

  describe.skip('it can update the rules', () => {
    beforeEach(() => {
      const card = cy.get('.el-card')
      card.click()
    })
    it('can remove a rule', () => {
      cy.get('.select--argument').should('have.length', 3)
      cy.get('.select--connector').should('have.length', 2)
      cy.get('.el-form-item__content > .el-button--danger').click()
      cy.get('.select--argument').should('have.length', 2)
      cy.get('.select--connector').should('have.length', 1)
    })
    it('can add a rule', () => {
      cy.get('.select--argument').should('have.length', 3)
      cy.get('.select--connector').should('have.length', 2)
      cy.get('.el-form-item__content > .el-button--success').click()
      cy.get('.select--argument').should('have.length', 4)
      cy.get('.select--connector').should('have.length', 3)
    })
    it('can change a rule', () => {
      cy.get(':nth-child(5) > .el-form-item > .el-form-item__content > .el-cascader > .el-cascader__label').click()
      const item = cy.get('.select--argument__cascader .el-cascader-menu .el-cascader-menu__item').first()
      item.should('have.text', 'Pizza Donalds')
      item.trigger('mouseenter')

      cy.wait(100)

      const secondItem = cy.get('.select--argument__cascader .el-cascader-menu').eq(1).find('.el-cascader-menu__item').first()
      secondItem.should('have.text', 'Status')
      secondItem.trigger('mouseenter')

      cy.wait(100)

      const thirdItem = cy.get('.select--argument__cascader .el-cascader-menu').eq(2).find('.el-cascader-menu__item').first()
      thirdItem.should('have.text', 'Pizza Donalds - Status')
      thirdItem.trigger('click')

      cy.get(':nth-child(1) > :nth-child(2) > .el-form-item > .el-form-item__content').click()
      cy.get('.el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(2)').eq(2).click()
      cy.get(':nth-child(3) > .el-button--success').click()

      cy.get('.el-notification').contains('Success')
      cy.get('.el-card').click()

      cy.get(':nth-child(1) > :nth-child(2) > .el-form-item > .el-form-item__content input').should('have.value', 'OR')
      cy.get(':nth-child(5) > .el-form-item > .el-form-item__content > .el-cascader > .el-cascader__label').should(($div) => {
        const text = $div.text()
        expect(text).to.include('Pizza Donalds - Status')
        expect(text).not.to.include('! Pizza Donalds - Status')
      })
    })
  })
  it('can add a tag', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get('.tags > div > .el-button').click()
    cy.wait(200)
    cy.get(':nth-child(2) > .el-select > .el-input > .el-input__inner').click()
    cy.wait(200)
    cy.get('.el-scrollbar__view > :nth-child(1) > .tag').click()

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

  it.skip('can reset the process', () => {
    const card = cy.get('.el-card')
    card.click()

    cy.get(':nth-child(5) > .el-form-item > .el-form-item__content > .el-cascader > .el-cascader__label').click()
    const item = cy.get('.select--argument__cascader .el-cascader-menu .el-cascader-menu__item').first()
    item.should('have.text', 'Pizza Donalds')
    item.trigger('mouseenter')

    cy.wait(100)

    const secondItem = cy.get('.select--argument__cascader .el-cascader-menu').eq(1).find('.el-cascader-menu__item').first()
    secondItem.should('have.text', 'Status')
    secondItem.trigger('mouseenter')

    cy.wait(100)

    const thirdItem = cy.get('.select--argument__cascader .el-cascader-menu').eq(2).find('.el-cascader-menu__item').first()
    thirdItem.should('have.text', 'Pizza Donalds - Status')
    thirdItem.trigger('click')
    cy.get(':nth-child(5) > .el-form-item > .el-form-item__content > .el-cascader > .el-cascader__label').should(($div) => {
      const text = $div.text()
      expect(text).to.include('Pizza Donalds - Status')
      expect(text).not.to.include('! Pizza Donalds - Running')
    })

    cy.get('.el-form-item__content > .el-button--success').click()
    cy.get('.el-form-item__content > .el-button--success').click()
    cy.get('.el-form-item__content > .el-button--success').trigger('mouseleave')
    cy.get('.select--argument').should('have.length', 5)
    cy.get('.select--connector').should('have.length', 4)

    cy.wait(200)
    cy.get('.el-button--danger').eq(1).click()
    cy.wait(200)
    cy.get('.select--argument').should('have.length', 3)
    cy.get('.select--connector').should('have.length', 2)
    cy.get(':nth-child(5) > .el-form-item > .el-form-item__content > .el-cascader > .el-cascader__label').should(($div) => {
      const text = $div.text()
      expect(text).to.include('! Pizza Donalds - Running')
      expect(text).not.to.include('Pizza Donalds - Status')
    })
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
