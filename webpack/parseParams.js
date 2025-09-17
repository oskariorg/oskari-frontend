const exampleCommand = `
-----------------------------------------------------------
Development (version defaults to "devapp"):
    npm start -- --env.appdef=applications
Production (version example 44.6 - defaults to package.json version):
    npm run build -- --env.appdef=44.6:applications
-----------------------------------------------------------
`;

module.exports = function parseParams (env) {
    const appdef = getParam(env, 'appdef');
    if (!appdef) {
        throw new Error('Must give "appdef" env variable, eg.:' + exampleCommand);
    }

    const parts = appdef.split(':');

    if (parts.length > 2) {
        throw new Error('Format for "appdef" is "version:pathToAppsetupDirectory", eg.: ' + exampleCommand);
    }

    const version = getVersion(parts);
    const isDevServer = version === 'devapp';
    const pathParam = parts.length > 1 ? parts[1] : parts[0];

    const externalDomain = getParam(env, 'domain') || '';
    // https://v4.webpack.js.org/configuration/dev-server/#devserverpublic
    // -> "Make sure devServer.publicPath always starts and ends with a forward slash."
    const publicPath = getParam(env, 'absolutePublicPath') === 'true' || externalDomain || isDevServer ? '/' : '';

    const params = {
        version,
        pathParam,
        publicPathPrefix: externalDomain + publicPath
    };

    return params;
};

function getParam (env, key) {
    if (!key || !process) {
        return;
    }
    const npmValue = process.env['npm_config_' + key];
    if (npmValue) {
        // this should work if run like this:
        //  npm run build --appdef=applications
        console.log('Found npm var for ' + key + ' = ' + npmValue);
        return npmValue;
    }

    if (!env) {
        return;
    }
    const envValue = env[key];
    if (envValue) {
        // this should work if run like this:
        //  npm run build -- --env.appdef=applications
        console.log('Found env var for ' + key + ' = ' + envValue);
    }

    return envValue;
}

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
