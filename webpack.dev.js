const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    devServer: {
        proxy: [{
            context: ['**', '!Oskari/dist/poc/full-map/**'],
            target: 'http://localhost:8080',
        }]
    }
});
