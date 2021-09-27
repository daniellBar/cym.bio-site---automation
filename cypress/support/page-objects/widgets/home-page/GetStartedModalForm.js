/// <reference types="cypress"/>

import { modalInputFields } from "../../../../fixtures/modalData.json";
import { widgetUtils } from "../widgetUtils.js";

// Selectors
// homepage form selectors
const GET_STARTED_FORM_INPUT =
  '.homepage-form-buttons .form-email-lead-form input[name="email"]';
const GET_STARTED_FORM_BUTTON =
  '.homepage-form-buttons .form-email-lead-form button[type="submit"]';

// modal form selectors
const GET_STARTED_MODAL = "#modal-lead-form";
const MODAL_FIELD_SELECTORS = {
  GET_STARTED_MODAL_EMAIL_INPUT:
    'input[data-reactid=".hbspt-forms-0.1:$0.$email.0"]',
  GET_STARTED_MODAL_FIRST_NAME_INPUT:
    'input[data-reactid=".hbspt-forms-0.1:$1.$firstname.0"]',
  GET_STARTED_MODAL_LAST_NAME_INPUT:
    'input[data-reactid=".hbspt-forms-0.1:$2.$lastname.0"]',
  GET_STARTED_MODAL_PHONE_NUMBER_INPUT:
    'input[data-reactid=".hbspt-forms-0.1:$3.$phone.0"]',
  GET_STARTED_MODAL_COMPANY_NAME_INPUT:
    'input[data-reactid=".hbspt-forms-0.1:$4.$company.0"]',
};
const INVALID_INPUT = "invalid error";

// enters mail address to the mail input on main page
export const enterEMail = (emailAddress) => {
  // get the input element and enter mail input
  cy.log(`typing email address: "${emailAddress}" into Get Started input`);
  cy.get(GET_STARTED_FORM_INPUT).type(emailAddress);
};

// clicks Get Started button on main page
export const clickGetStartedButton = () => {
  cy.log("clicking Get Started Button");
  cy.get(GET_STARTED_FORM_BUTTON).should("be.visible").click();
};

// function checks form modal visibility.
// it has two input options: 'positive' ,'negative'
export const validateGetStartedModalIsOpen = (testType) => {
  widgetUtils.checkValidStringInputForTestType(testType);
  testType === "positive"
    ? cy.get(GET_STARTED_MODAL).should("be.visible")
    : cy.get(GET_STARTED_MODAL).should("be.hidden");
};

// function fills the input fields inside the form modal.
// it gets an object of fields and values:{email:'daniel@gmail.com',firstName:'daniel',..}
export const fillModalForm = (enteredFieldsInputs = {}) => {
  // get input fields from fixtures
  const inputFields = modalInputFields;

  // for each field (from fixtures object) if it has a value in the function input: enteredFieldsInputs
  // than type the value into the field element in the modal.
  // this implementation saves writing many if statements to check each option
  cy.wrap(inputFields).each((inputField) => {
    cy.get(MODAL_FIELD_SELECTORS[inputField.fieldSelector])
      .should("be.visible")
      // click on each field regardless if it was given in function input: enteredFieldsInputs.
      // this is because in order to load the css class: ".invalid .error" on the field input
      // (".invalid .error" class should also load on an empty mandatory field)
      // you need to make the app "aware" that the user interacted with the field.
      // clicking on the field element mimics it
      .click()
      .then(($field) => {
        // if the field was given as an option in function input: enteredFieldsInputs
        // than type to that field
        if (enteredFieldsInputs[inputField.fieldName]) {
          cy.log(
            `typing: "${
              enteredFieldsInputs[inputField.fieldName]
            }" into  field: "${inputField.fieldText}"`
          );
          cy.wrap($field)
            // clear command is for the email field.
            // the field gets the value from the previous action
            // when typing into the get started input in the homepage
            // it sets the input field in the modal (this is your website feature)
            // if this function gets the email field in its options then it will
            // clear the previous entered value
            .clear()
            .type(enteredFieldsInputs[inputField.fieldName]);
        }
      });
  });
};

// this function goes to each input field and checks that it does not
// have the css class: "hs-input invalid error"
// when having this class on any field element the form can not be submitted.
// after clicking "GET IN TOUCH" button we get the message: "Please complete all required fields"
// i dont want to actually submit the form so instead of clicking
// the button i just look for the class mentioned above.
// note: phone number is optional and it is considered valid as long as the input contains
// a number or string with only number characters
export const validateFormCanBeSubmitted = (testType) => {
  const invalidInputFields = [];
  widgetUtils.checkValidStringInputForTestType(testType);
  const inputFields = modalInputFields;
  cy.wrap(inputFields).each((fixtureInputField) => {
    cy.log(`checking for error in field: ${fixtureInputField.fieldText}`);

    cy.get(MODAL_FIELD_SELECTORS[fixtureInputField.fieldSelector]).then(
      ($fieldInput) => {
        // now working on the actual dom element
        // conditional Testing on an element state can be risky.
        // it should be used if we are sure that the element state is stable and wont change
        // again. i am calling this function after already filling the form so all input classes should
        // already be loaded and stable
        if ($fieldInput.hasClass(INVALID_INPUT)) {
          invalidInputFields.push(fixtureInputField.fieldText);
        }
      }
    );
  });

  // check if invalidInputFields is empty and assert accordingly
  cy.wrap(invalidInputFields)
    .each((invalidField) => {
      cy.log(`error was found in field: "${invalidField}"`);
    })
    .then((invalidInputFields) => {
      testType === "positive"
        ? expect(invalidInputFields.length).to.equal(0)
        : expect(invalidInputFields.length).to.be.greaterThan(0);
    });
};
