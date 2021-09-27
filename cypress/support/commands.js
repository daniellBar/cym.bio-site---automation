// my custom commands

Cypress.Commands.add(
  "validateSvgContent",
  ($element, pseudoSelector, validateAgainst) => {
    cy.log(`getting content for css pseudo selector: ${pseudoSelector}`);
    cy.wrap($element).then(($element) => {
      // get Window reference from element
      const win = $element[0].ownerDocument.defaultView;
      // getComputedStyle reads the css pseudo selector
      const pseudo = win.getComputedStyle($element[0], pseudoSelector);
      // read the value of the 'content' css property
      const content = pseudo.getPropertyValue("content");
      //validate
      expect(content).to.eq(validateAgainst);
    });
  }
);

Cypress.Commands.add("navigateAndValidate", (url, endpoint) => {
  cy.log(`navigating to: ${url}`);
  cy.visit(url);
  cy.url().should("include", endpoint);
});

Cypress.Commands.add("getIframeBody", (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its("0.contentDocument")
    .its("body")
    .should("not.be.undefined")
    .and("not.be.empty")
    .then(cy.wrap);
});
