import {
  validateHeaderMenusExists,
  validateHeaderMenusLinksWork,
  validateSubMenusText,
  validateSubMenusLinksWork,
  initRealHoverEventOnSubMenus,
} from "../../support/page-objects/widgets/header/Menus.js";

describe("header menus actions", () => {
  before(() => {
    cy.visit("/");
  });
  it("all menus should load and be visible", () => {
    validateHeaderMenusExists();
  });

  it("clicking on a menu link should navigate to correct endpoint", () => {
    validateHeaderMenusLinksWork();
  });

  it("sub menus should have the correct text", () => {
    validateSubMenusText();
  });

  it("clicking on a sub-menu link should navigate to correct endpoint", () => {
    validateSubMenusLinksWork();
  });

  it("hovering over menus with sub-menus. sub-menus should be visible", () => {
    initRealHoverEventOnSubMenus();
  });
});
