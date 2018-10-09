// http://eslint.org/docs/user-guide/configuring

module.exports = {
  "root": true,
  "env": {
    "browser": true,
  },
  "globals": {
      "Oskari": true,
      "jQuery": true,
      "MobileDetect": true,
      "DOMPurify": true,
      "_": true,
      "Cesium": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  "extends": "standard",
  // add your custom rules here
  "rules": {
    "indent": ["error", 4],
    // semicolons
    "semi": ["error", "always"],
    // allow templates to have placeholders as we use lodash templates
    "no-template-curly-in-string": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // enforce single quote
    "quotes": ["error", "single", {"allowTemplateLiterals": true, "avoidEscape": true}],
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
    "no-fallthrough": "off",

    // Temporary warn level for Travis-CI
    "brace-style": ["warn", "1tbs", { "allowSingleLine": true }],
    "camelcase": ["warn", { "properties": "never" }],
    "eqeqeq": ["warn", "always", { "null": "ignore" }],
    "handle-callback-err": ["warn", "^(err|error)$" ],
    "new-cap": ["warn", { "newIsCap": true, "capIsNew": false }],
    "no-extend-native": "warn",
    "no-mixed-spaces-and-tabs": "warn",
    "no-tabs": "warn",
    "no-throw-literal": "warn",
    "no-undef": "warn",
    "no-unmodified-loop-condition": "warn",
    "no-unneeded-ternary": ["warn", { "defaultAssignment": false }],
    "one-var": ["warn", { "initialized": "never" }],
    "standard/array-bracket-even-spacing": ["warn", "either"],
    "standard/computed-property-even-spacing": ["warn", "even"],
    "standard/no-callback-literal": "warn",
    "standard/object-curly-even-spacing": ["warn", "either"],
    "no-unreachable": "warn",
    "no-labels": ["warn", { "allowLoop": false, "allowSwitch": false }],
    "no-return-assign": ["warn", "except-parens"],
    "no-shadow-restricted-names": "warn"
  }
}