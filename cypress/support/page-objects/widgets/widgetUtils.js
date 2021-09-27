export const widgetUtils = {
  checkValidStringInputForTestType,
};

// function checks that input can only be the strings 'positive' or 'negative
function checkValidStringInputForTestType(testType) {
  const inputOptions = ["positive", "negative"];
  if (!inputOptions.includes(testType)) {
    throw `function only excepts input parameters: "positive" or " "negative".\n got input parameter: "${testType}"`;
  }
}
