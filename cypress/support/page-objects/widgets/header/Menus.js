/// <reference types="cypress"/>

import {
  menus,
  subMenus,
  dropdownPseudoElementContent,
} from "../../../../fixtures/menusData.json";

//Selectors
const HEADER_LINKS_CONTAINER = "#header-menu-list";
const MENU_WITH_CHILDREN = ".menu-item-has-children";
const SUB_MENU = ".sub-menu";

// function checks that the menus are loaded with text as expected and are visible on page.
// also for menus with dropdown it checks that the svg icon url is correct.
// note: this function does not check sub menus text. only what is visible at start for the user
export const validateHeaderMenusExists = () => {
  //get the menus list and traverse it
  _getMenus().each(($menu, index) => {
    // get menu name from fixtures
    const menuName = menus[index].name;

    cy.log(`checking visibility and text of menu element: ${menuName}`);
    // for each menu check visibility then get the link element and get its text.
    cy.wrap($menu)
      .should("be.visible")
      .find("a")
      .then((links) => {
        // if its a menu with a dropdown than validate dropdown icon
        if (links.length > 1) {
          const $linkElement = links[0];
          cy.log("validating menu dropdown icon");
          _validateSvgContent($linkElement);
        }
      })
      // use first because menus with hover dropdown have more than one link
      .first()
      .invoke("text")
      .then((text) => {
        // text value has (given by developers) css 'transform' property: uppercase.
        // so converting all text chars to lowercase
        const textToValidate = text.toLocaleLowerCase();
        const validateAgainst = menuName.toLocaleLowerCase();

        // validation
        expect(textToValidate).to.deep.equal(validateAgainst);
      });
  });
};

// function checks that each menu "click" navigate to the right page.
// note: this function does not check sub menus urls. it only "clicks" what is visible at start for the user
export const validateHeaderMenusLinksWork = () => {
  // get menus and traverse them
  _getMenus().each(($menu, index) => {
    // get endpoint string from fixtures
    const validateAgainst = menus[index].endpoint;

    //to prevent element detachment from the DOM, instead of clicking an element,
    //get its href attribute and use cy.visit command
    const link = $menu.find("a").first();
    const url = link.attr("href");

    // navigate and validate using custom command
    cy.navigateAndValidate(url, validateAgainst);
  });
};

// function checks the text of the sub-menus dropdown that a user see when hovering
// over "Company" and "RESOURCES" menus.
// it doesn't check visibility because they are only visible on hover.
export const validateSubMenusText = () => {
  _runFuncOnEachSubMenuItem(_validateSubMenuItemText);
};

// function checks each sub-menu link navigate to the right page.
export const validateSubMenusLinksWork = () => {
  _runFuncOnEachSubMenuItem(_validateSubMenuItemLinkWork);
};

// function gets a callback function and runs it on each menu item in the header sub-menu
const _runFuncOnEachSubMenuItem = (callbackFn) => {
  // getting sub-menus array from fixtures
  const fixturesSubMenus = subMenus;

  // wrapping fixturesSubMenus array in order to traverse it inside cypress context
  cy.wrap(fixturesSubMenus)
    // for each sub-menu object inside fixturesSubMenus array
    .each((fixtureSubMenu, subMenuIndex) => {
      // find the matching sub-menu element in the DOM
      _getMenus()
        .filter(MENU_WITH_CHILDREN)
        .eq(subMenuIndex)
        .find(SUB_MENU)
        // get all link elements for the current sub-menu
        .find("a")
        .each(($link, linkIndex) => {
          callbackFn($link, linkIndex, fixtureSubMenu);
        });
    });
};

// validate sub-menu element text with matching text in fixtures
const _validateSubMenuItemText = ($link, index, subMenu) => {
  const menuItem = subMenu.menuItems[index];
  cy.log(
    `validating text of sub-menu element: "${menuItem.name}" under parent menu: "${subMenu.parentName}" `
  );
  cy.wrap($link)
    // in this case there is no css transform property for text so no need for text manipulation
    .should("have.text", menuItem.name);
};

//validate a sub-menu link is working
const _validateSubMenuItemLinkWork = ($link, index, subMenu) => {
  const url = $link.attr("href");
  const validateAgainst = subMenu.menuItems[index].endpoint;
  // navigate and validate using custom command
  cy.navigateAndValidate(url, validateAgainst);
};

//function returns an array of header menu elements
const _getMenus = () => {
  return cy.get(HEADER_LINKS_CONTAINER).children();
};

// this function checks that the url to the svg of the rendered "dropdown icon" is correct (typo or broken url).
// the url info is inside the "after" css pseudo element.
// not sure if this action is very useful or necessary but wrote it anyway
const _validateSvgContent = ($linkElement) => {
  // calling a custom command i created in commands.js
  cy.validateSvgContent($linkElement, "after", dropdownPseudoElementContent);
};

// function create a real hover event using a cypress plugin
export const initRealHoverEventOnSubMenus = () => {
  cy.log("Hovering over Menus with Sub-Menus");
  _getMenus()
    .filter(MENU_WITH_CHILDREN)
    .each((menu, index) => {
      const menuName = subMenus[index].parentName;

      // can check in many ways. decided to check with opacity which
      // is the css props that changes on hover state
      // also possible to click on sub-menus, etc.
      cy.log("before hovering opacity should equal 0");
      cy.wrap(menu)
        .find(SUB_MENU)
        .invoke("css", "opacity")
        .should("equal", "0");
      cy.log(`hovering over menu item: ${menuName} `);
      cy.wrap(menu)
        .realHover()
        .find(SUB_MENU)
        .invoke("css", "opacity")
        .should("equal", "1");
    });
};
