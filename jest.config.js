module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/tests/jest/setupTests.js'
    ],
    moduleNameMapper: {
        '^oskari-ui(.*)$': '<rootDir>/src/react/$1',
        '^antd(.*?)style/index.js$': '<rootDir>/tests/jest/styleMock.js',
        '\\.(css|less)$': '<rootDir>/tests/jest/styleMock.js',
        '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
        '^ol-mapbox-style$': '<rootDir>/node_modules/ol-mapbox-style/src/index.js'
    },
    fakeTimers: {
        enableGlobally: true
    },
    verbose: true,
    transformIgnorePatterns: [
        // If tests crash due to a failing import ("Cannot use import outside of a module" or similar message) make sure you add the failing dependencies to transformIgnorePatterns.
        // In case of a nested transitive dependency it might not be enough to add the one that is finally producing the error but the whole import tree.
        // e.g. when dependency A imports dependency B we might need to add both A and B to be transpiled for the tests to work.
        'node_modules/(?!(ol|color-parse|color-space|color-rgba|color-name|antd|rc-util|jsts|geotiff|quick-lru|rbush|quickselect|pbf|mapbox-to-css-font)).+\\.js$'
    ]
};
