
module.exports = {
    'testEnvironment': 'jsdom',
    'setupFilesAfterEnv': [
        '<rootDir>/setupTests.js'
    ],
    'moduleNameMapper': {
        '^oskari-ui(.*)$': '<rootDir>/src/react/$1',
        '^antd(.*?)style/index.js$': '<rootDir>/tests/jest/styleMock.js',
        '\\.(css|less)$': '<rootDir>/tests/jest/styleMock.js'
    },
    verbose: true,
    'transformIgnorePatterns': [
        'node_modules/(?!(ol)/)'
    ]
};
