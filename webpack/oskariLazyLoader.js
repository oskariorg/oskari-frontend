// const { urlToRequest } = require('loader-utils');
// TODO: remove loader-utils?
// https://github.com/webpack/loader-utils/releases/tag/v3.0.0
// https://github.com/webpack/loader-utils/commit/0d895223ca0e093ed6555459511c90096828066b
module.exports = function (source) {
    if (!this.query) {
        throw new Error('Param with bundle name must be given, eg. "import \'oskari-lazy-loader?bundlename!path/to/bundle.js\'"');
    }

    const stringifyRequest = () => {
        JSON.stringify(loaderContext.utils.contextify(this.context, request))
    }
    const name = this.query.slice(1);
    const bundlePath = stringifyRequest(`oskari-loader!${this.resourcePath}`);

    return `Oskari.bundle_manager.registerDynamic('${name}', function() {return import(/* webpackChunkName: "chunk_${name}" */ ${bundlePath});});\n`;
};
