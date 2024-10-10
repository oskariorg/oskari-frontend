module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/tests/jest/setupTests.js'
    ],
    moduleNameMapper: {
        '^oskari-ui(.*)$': '<rootDir>/src/react/$1',
        '^antd(.*?)style/index.js$': '<rootDir>/tests/jest/styleMock.js',
        '\\.(css|less)$': '<rootDir>/tests/jest/styleMock.js',
        '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js'
    },
    fakeTimers: {
        enableGlobally: true
    },
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(ol|color-parse|color-space|color-rgba|color-name|antd|rc-util|jsts|geotiff|quick-lru)).+\\.js$'
    ]
};
