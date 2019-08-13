const path = require('path');

module.exports = {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'], // allow use of oskari-frontend node_modules from external projects
    symlinks: false,
    alias: {
        'oskari-ui': path.resolve(__dirname, '../src/react')
    }
};
