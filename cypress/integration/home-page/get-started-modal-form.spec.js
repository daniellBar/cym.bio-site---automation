import {
  enterEMail,
  clickGetStartedButton,
  validateGetStartedModalIsOpen,
  fillModalForm,
  validateFormCanBeSubmitted,
} from "../../support/page-objects/widgets/home-page/GetStartedModalForm.js";

import { fillModalFormTestingData } from "../../fixtures/modalData.json";

describe("get started modal form actions", () => {
  before(() => {
    cy.visit("/");
  });

  // instead of getting the close modal button and click it at the end of some test
  // reload the page to remove the modal after every test
  afterEach(() => {
    cy.reload();
  });

  // a negative test.
  // after checking the form functionality i see that the modal wont be opened if
  // the input string has no '@' character
  it("typing a string without @ character, modal should not be opened ", () => {
    const { inValidEmailString } = fillModalFormTestingData;
    enterEMail(inValidEmailString);
    clickGetStartedButton();
    validateGetStartedModalIsOpen("negative");
  });

  // a positive test
  // as long as the input string has '@' character the modal will open,
  // even if email syntax is not valid
  it("typing a string with @ character, modal should be opened ", () => {
    const { inValidEmailSyntax } = fillModalFormTestingData;
    enterEMail(inValidEmailSyntax);
    clickGetStartedButton();
    validateGetStartedModalIsOpen("positive");
  });

  // full flow positive test for the modal form itself.
  // in the modal, fill all required fields and enter a syntax valid email such as: daniel@gmail.com
  it("typing valid inputs, modal should be opened and form should be submitted without errors ", () => {
    const { fullyValidEmail, firstName, lastName, companyName, phoneNumber } =
      fillModalFormTestingData;
    enterEMail(fullyValidEmail);
    clickGetStartedButton();
    validateGetStartedModalIsOpen("positive");
    fillModalForm({
      firstName,
      lastName,
      phoneNumber,
      companyName,
    });
    validateFormCanBeSubmitted("positive");
  });

  // full flow negative test for the modal form itself.
  // all fields will be filled but with invalid inputs
  it("typing invalid inputs, should find errors on fields, and form should not be able to be submitted ", () => {
    const {
      fullyValidEmail,
      inValidEmailSyntax,
      firstName,
      lastName,
      companyName,
      inValidPhoneNumber,
    } = fillModalFormTestingData;
    enterEMail(fullyValidEmail);
    clickGetStartedButton();
    validateGetStartedModalIsOpen("positive");
    fillModalForm({
      email: inValidEmailSyntax,
      firstName,
      lastName,
      phoneNumber: inValidPhoneNumber,
      companyName,
    });
    validateFormCanBeSubmitted("negative");
  });

  // full flow negative test for the modal form itself.
  // mandatory fields will remain empty
  it("leave mandatory fields empty, should find errors on fields, and form should not be able to be submitted ", () => {
    const { fullyValidEmail } = fillModalFormTestingData;
    enterEMail(fullyValidEmail);
    clickGetStartedButton();
    validateGetStartedModalIsOpen("positive");
    fillModalForm();
    validateFormCanBeSubmitted("negative");
  });
});
