/* Settings defined here are for Jest testing framework.
 * Actual babel configurations related to building are defined in webpack.config.js.
 */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-react'
    ]
};
