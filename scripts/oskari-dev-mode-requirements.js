const fs = require('fs');
const helper = require('./console-helper.js');

fs.lstat('../oskari-frontend', (err) => {
    if (err) {
        helper.oskariPeerNotFound();
        helper.exit(1);
    }
});
