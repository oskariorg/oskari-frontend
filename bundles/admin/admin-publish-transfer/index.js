// needs to be exposed!! maybe try updating to npm install and imports from dependency: https://github.com/benjamine/jsondiffpatch
// FIXME: import jsondiff from npm dependencies and migrate imports
import '../../../libraries/jsondiffpatch/jsondiffpatch.js';
import '../../../libraries/jsondiffpatch/jsondiffpatch-formatters.js';
import '../../../libraries/jsondiffpatch/formatters-styles/html.css';

import './publisher/TransferTool.js';

// only imports the publisher tool, no need to start anything
// this is started as a lazy loaded admin-bundle to provide more publisher functionality (tool to transfer appsetup json between envs)
// register create function for bundleid
Oskari.bundle('admin-publish-transfer', () => {
    return {
        start: () => { /* no-op */ },
        stop: () => { /* no-op */ }
    };
});
