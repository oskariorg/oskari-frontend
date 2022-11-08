const exampleCommand = `
-----------------------------------------------------------
Development (version defaults to "devapp"):
    npm start -- --env.appdef=applications/sample
Production (version example 44.6 - defaults to package.json version):
    npm run build -- --env.appdef=44.6:applications/sample
-----------------------------------------------------------
`;

module.exports = function parseParams (env) {
    if (!env || !env.appdef) {
        throw new Error('Must give "appdef" env variable, eg.:' + exampleCommand);
    }

    const parts = env.appdef.split(':');

    if (parts.length > 2) {
        throw new Error('Format for "appdef" is "version:pathToAppsetupDirectory", eg.: ' + exampleCommand);
    }

    const version = getVersion(parts);
    const pathParam = parts.length > 1 ? parts[1] : parts[0];

    const externalDomain = env.domain || '';
    const publicPath = env.absolutePublicPath === 'true' || externalDomain ? '/' : '';

    const params = {
        version,
        pathParam,
        publicPathPrefix: externalDomain + publicPath
    };

    if (env.theme) {
        params.theme = env.theme;
    }

    return params;
};

function getVersion (appdefParts) {
    const isDevServer = !!process.env.WEBPACK_DEV_SERVER;
    if (appdefParts.length > 1) {
        return appdefParts[0];
    } else if (!isDevServer) {
        // version from package.json
        return process.env.npm_package_version;
    }
    return 'devapp';
}
