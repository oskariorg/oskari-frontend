const exampleCommand = `
-----------------------------------------------------------
Development (version defaults to "devapp"):
    npm start -- --env.appdef=applications/sample
Production (version example 44.6):
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

    const version = parts.length > 1 ? parts[0] : 'devapp';
    const pathParam = parts.length > 1 ? parts[1] : parts[0];

    return {
        version,
        pathParam,
        publicPathPrefix: env.absolutePublicPath === 'true' ? '/' : ''
    };
};
