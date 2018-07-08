const exampleCommand = 'npm run build -- --env.appdef=44.6:applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json';

module.exports = function parseParams(env) {
    if (!env || !env.appdef) {
        throw new Error('Must give "appdef" env variable, eg.: ' + exampleCommand);
    }

    const parts = env.appdef.split(':');

    if (parts.length > 2) {
        throw new Error('Format for "appdef" is "version:pathToMinifierAppSetup", eg.: ' + exampleCommand);
    }

    return parts;
}