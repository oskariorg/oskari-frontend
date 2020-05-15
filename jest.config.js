
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/tests/jest/setupTests.js'
    ],
    moduleNameMapper: {
        '^oskari-ui(.*)$': '<rootDir>/src/react/$1',
        '^antd(.*?)style/index.js$': '<rootDir>/tests/jest/styleMock.js',
        '\\.(css|less)$': '<rootDir>/tests/jest/styleMock.js'
    },
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(ol)/)'
    ]
    /*
    ,transform: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/jest/fileTransformer.js'
    }
    */
};
