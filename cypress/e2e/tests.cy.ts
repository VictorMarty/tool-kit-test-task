/// <reference types="cypress" />

import selectors from "../selectors";

// TODO: Нужно сделать мок данных для консистентных тестов (сейчас работают только с одним access_token)

const url = process.env.TEST_URL || "http://localhost:5173/";

describe("Main page", () => {
  it("Show main page with viewier repositories", () => {
    cy.visit(url);
    const listItems = cy
      .get(selectors.main.list.overview, { timeout: 10000 })
      .should("exist")
      .should("be.visible");

    listItems.get(selectors.card.overview).should("have.length", 10);
  });

  it("You can change page", () => {
    cy.visit(url);
    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("have.text", "gitTutorial");
    cy.get(selectors.main.pagination.getItemByNumber(2)).click();
    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("not.have.text", "gitTutorial");
    cy.get(selectors.main.pagination.getItemByNumber(2))
      .then(($el) => $el[0].className)
      .should("eq", "active-page");
  });

  it("You can find repositories", () => {
    cy.visit(url);
    cy.get(selectors.card.overview, { timeout: 10000 }).should("be.visible");
    cy.get(selectors.main.input)
      .type("hello")
      .then(() => {
        cy.get(selectors.main.button).click();
      });
    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("have.text", "phonegap-start");
  });

  it("after reload request data saved", () => {
    cy.visit(url);
    cy.get(selectors.card.overview, { timeout: 10000 }).should("be.visible");
    cy.get(selectors.main.input)
      .type("all-stars-js")
      .then(() => {
        cy.get(selectors.main.button).click();
      });
    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("have.text", "all-the-stars-js");

    cy.get(selectors.main.pagination.getItemByNumber(2)).click();

    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("have.text", "ecomerce_chakra_functions");
    cy.get(selectors.main.pagination.getItemByNumber(2))
      .then(($el) => $el[0].className)
      .should("eq", "active-page");

    cy.reload();

    cy.get(selectors.card.overview, { timeout: 10000 })
      .get(selectors.card.titleLink)
      .first()
      .should("have.text", "ecomerce_chakra_functions");
    cy.get(selectors.main.pagination.getItemByNumber(2))
      .then(($el) => $el[0].className)
      .should("eq", "active-page");
  });
});

describe("Pepository page", () => {
  it("You can route to repository page", () => {
    cy.visit(url);
    const listItems = cy
      .get(selectors.main.list.overview, { timeout: 10000 })
      .should("exist")
      .should("be.visible");

    listItems.get(selectors.card.titleLink).first().click();

    cy.get(selectors.repo.author).should("have.text", "VictorMarty");
  });

  it("All elements exist", () => {
    cy.visit(url + "R_kgDOKCOxuw");
    const listItems = cy
      .get(selectors.card.overview, { timeout: 10000 })
      .should("exist")
      .should("be.visible");

    listItems.get(selectors.card.titleLink).first().click();

    cy.get(selectors.repo.author).should("have.text", "VictorMarty");
    cy.get(selectors.card.titleLink).should("have.text", "tool-kit-test-task");
    cy.get(selectors.card.link).should("not.exist");
    cy.get(selectors.repo.languagesList).should(
      "have.text",
      "JavaScriptHTMLCSSTypeScript",
    );
  });
});
