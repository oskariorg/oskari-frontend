const path = require('path');

module.exports = function (source) {
    if (!this.query) {
        throw new Error('Param with bundle name must be given, eg. "import \'oskari-lazy-loader?bundlename!path/to/bundle.js\'"');
    }
    const name = this.query.slice(1);

    // resourcePath is the full path from root to file in the disk (atleast on WSL)
    const axe = `${path.sep}node_modules${path.sep}`;
    const parts = this.resourcePath.split(axe);

    // anything from oskari comes in parts[1], anything from app itself comes from parts[0] -> mobileuserguide in pti
    // import 'oskari-lazy-loader?metadatasearch!oskari-frontend/packages/catalogue/metadatasearch/bundle.js';
    // -> `oskari-loader!oskari-frontend/packages/catalogue/metadatasearch/bundle.js`
    // import 'oskari-lazy-loader?mobileuserguide!../../bundles/paikkatietoikkuna/mobileuserguide/bundle.js';
    // -> `oskari-loader!../../bundles/paikkatietoikkuna/mobileuserguide/bundle.js`
    const bundlePath = `oskari-loader!${parts.length === 1 ? parts[0] : parts[1]}`;
    let separatorReplaced = bundlePath;
    if (path.sep === '\\') {
        separatorReplaced = bundlePath.replaceAll(/\\/g, '\\\\');
    }
    return `Oskari.bundle_manager.registerDynamic('${name}', function() {return import(/* webpackChunkName: "chunk_${name}" */ '${separatorReplaced}');});\n`;
};
