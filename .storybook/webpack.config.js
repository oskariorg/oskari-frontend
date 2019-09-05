const resolveConfig = require('../webpack/resolveConfig.js');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
    test: /\.less$/,
    use: [
        'style-loader', 
        'css-loader',
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true
            }
        }]
    });

    config.resolve = resolveConfig;

    // Return the altered config
    return config;
};