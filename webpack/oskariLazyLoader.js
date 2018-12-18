const {stringifyRequest} = require('loader-utils');

module.exports = function (source) {
    if (!this.query) {
        throw new Error('Param with bundle name must be given, eg. "import \'oskari-lazy-loader?bundlename!path/to/bundle.js\'"');
    }
    const name = this.query.slice(1);
    const bundlePath = stringifyRequest(this, `oskari-loader!${this.resourcePath}`);

    return `Oskari.bundle_manager.registerDynamic('${name}', function() {return import(/* webpackChunkName: "chunk_${name}" */ ${bundlePath});});\n`;
};
