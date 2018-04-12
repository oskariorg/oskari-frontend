// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  "globals": {
      "Oskari": true,
      "jQuery": true,
      "MobileDetect": true,
      "DOMPurify": true,
      "_": true,
      "ol": true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // add your custom rules here
  'rules': {
    'indent': ["warn", 4],
    // semicolons
    'semi': ["warn", "always"],
    // allow templates to have placeholders as we use lodash templates
    'no-template-curly-in-string': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}