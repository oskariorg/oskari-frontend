const resolveConfig = require('./webpack/config.js').RESOLVE;
// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        browser: true
    },
    globals: {
        _: false,
        ajaxUrl: false,
        Backbone: false,
        Cesium: false,
        Channel: false,
        ClipperLib: false,
        d3: false,
        define: false,
        jQuery: false,
        jsts: false,
        MobileDetect: false,
        moment: false,
        Oskari: false,
        Proj4js: false,
        turf: false,
        __webpack_public_path__: false,
        CESIUM_BASE_URL: false,
        // ---- jest tests
        describe: false,
        it: false,
        afterAll: false,
        expect: false,
        test: false,
        jest: false
    // ----
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        'standard',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended'
    ],
    // add your custom rules here
    rules: {
        'no-restricted-properties': ['error',
            {
                property: 'getRequestBuilder', message: 'Please use Oskari.requestBuilder() instead.'
            },
            {
                property: 'getEventBuilder', message: 'Please use Oskari.eventBuilder() instead.'
            }
        ],
        'indent': ['error', 4],
        // semicolons
        'semi': ['error', 'always'],
        // allow templates to have placeholders as we use lodash templates
        'no-template-curly-in-string': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // enforce single quote
        'quotes': ['error', 'single', {
            allowTemplateLiterals: true,
            avoidEscape: true
        }],
        'no-unused-vars': ['error', {
            vars: 'all',
            args: 'none',
            ignoreRestSiblings: false
        }],
        'no-fallthrough': 'off',
        'standard/no-callback-literal': 'off',
        'import/no-default-export': 'error',
        'quote-props': ['warn', 'consistent-as-needed'],
        'lines-between-class-members': ['warn', 'always'],
        'prefer-const': ['warn', {
            destructuring: 'any',
            ignoreReadBeforeAssign: false
        }],
        'no-prototype-builtins': 'warn',
        'object-curly-newline': ['error', { consistent: true }],
        'dot-notation': 'warn',

        // Temporary warn level for Travis-CI
        'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
        'camelcase': ['warn', {
            properties: 'never'
        }],
        'eqeqeq': ['warn', 'always', {
            null: 'ignore'
        }],
        'handle-callback-err': ['warn', '^(err|error)$'],
        'new-cap': ['warn', {
            newIsCap: true,
            capIsNew: false
        }],
        'no-unmodified-loop-condition': 'warn',
        'no-unneeded-ternary': ['warn', { defaultAssignment: false }],
        'one-var': ['warn', { initialized: 'never' }],
        'no-labels': ['warn', {
            allowLoop: false,
            allowSwitch: false
        }]
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: resolveConfig
                }
            }
        },
        'react': { version: 'detect' }
    },
    overrides: [
        {
            files: ['**/*.js'],
            rules: {
                'import/no-unresolved': ['error', { 'ignore': ['^olcs\\/css\\/olcs\\.css$'] }]
            }
        }
    ]
};
