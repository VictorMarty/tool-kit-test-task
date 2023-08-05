import selectors from "../selectors"

describe('Main page', () => {
  it('Shows main pages with viewier repo', () => {
    cy.visit('http://localhost:5173/')
    const listItems = cy.get(selectors.main.list.overview).as("getListRepo");
    cy.wait("@getListRepo", {
      timeout: 10000
    })

    listItems.should('exist');
  })

  it('You can change page', () => {
    cy.visit('http://localhost:5173/')
    const listItems = cy.get(selectors.main.list.overview).as("getListRepo");
    cy.wait("@getListRepo", {
      timeout: 10000
    })

    listItems.should('exist');
  })

})