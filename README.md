# Oskari

[Oskari](http://www.oskari.org/) Map Application Framework aims to provide a framework and a collection of functionality-enhancing bundles and plugins for rapid development of feature-rich GI web applications.

Documentation available at [http://www.oskari.org].

This repository holds the frontend framework code for Oskari. Developing the frontend framework requires a frontend application. The frontend application should be located next to the framework directory. You may checkout a sample frontend application source code from [GitHub](https://github.com/oskariorg/sample-application "Sample Oskari frontend application").

You will also need oskari-server to be running that responds to the XHR requests made by the frontend. You can download a pre-compiled copy of the server from [http://www.oskari.org/download]. You may also build it from source by cloning [oskari-server](https://github.com/oskariorg/oskari-server) and [sample-server-extension](https://github.com/oskariorg/sample-server-extension).

Any application should use the sample-server-extension template as base for customized server and create an app-specific repository for the frontend (see [sample-application](https://github.com/oskariorg/sample-application)). Oskari frontend applications are built using Webpack.

## Preparations

Make sure you have at least Node 8.x / NPM 5.x. 

Run `npm install` in the frontend framework repository root.
Run `npm install` in the frontend application repository root.
Make sure you have oskari-server running on localhost port 8080 (can be customized on webpack.config.js).

## Run in development

Webpack dev server is used to serve the JS bundle and assets when running in local development. XHR calls will be proxied to the Java backend assumed to be running on localhost:8080.

So that the server knows to look for the JS bundle and assets from the right place, we need to have the client version configured in the Oskari-server `oskari-ext.properties`:

```
oskari.client.version=dist/devapp
```

To start Webpack dev server run `npm start`. The start script in oskari-frontend package.json defaults to the sample application directory but this can be parameterized for custom apps.

When you see "Compiled successfully." in the terminal, you can open the app in the browser at `localhost:8081`.

The dev server has automatic reloading enabled when you save changes to JS code and hot reloading for S/CSS without need for full browser reload.

## Build for production

To build minifed JS and assets run: `npm run build`.

This will produce optimized files for production under `dist/devapp/servlet/`. The build script in oskari-frontend package.json again defaults to the sample application directory. It also defaults to a version named `devapp`. Both the app and version number can be parameterized for custom apps.

Note: The version number given for the build command needs to match the client version (`oskari.client.version`) in Oskari-server `oskari-ext.properties`.

Special case: If on your production server your application index.jsp location is mapped to something else than the root (eg. `http://yourdomain.com/my-oskari-app/`), but the assets are mapped relative to the root (eg. `http://yourdomain.com/Oskari/dist/...`), you need to add the build parameter `--env.absolutePublicPath=true` like this:

    npm run build -- --env.absolutePublicPath=true

### How to setup custom frontend

See https://github.com/oskariorg/sample-application for an example how to create app-specific functionality and use oskari-frontend and oskari-frontend-contrib. Use sample-application template as base and create your own application.

Run npm `build` and `start` commands in your application repository root.

### FAQ

#### "Out of memory" error when running Webpack

If you get an error when running the build like  "FATAL ERROR: Committing semi space failed. Allocation failed - process out of memory" or "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory" you need to configure some more memory for the node-process.

In linux you can use:

    export NODE_OPTIONS=--max_old_space_size=4096
    npm run build -- --env.appdef=1.49.0:applications/sample/

Or in Windows:

    set NODE_OPTIONS=--max_old_space_size=4096 && npm run build -- --env.appdef=1.49.0:applications/sample/

#### Production build "freezes"

CPU usage of the computer shows nothing is happening, but the bash/cmd is still executing the build command. Try setting "parallel" to false on UglifyJsPlugin configuration in webpack.config.js:

    new UglifyJsPlugin({
        sourceMap: true,
        parallel: false
    })

# Reporting issues

All Oskari-related issues should be reported here: https://github.com/oskariorg/oskari-docs/issues

# Contributing

Please read the [contribution guidelines](http://oskari.org/documentation/development/how-to-contribute) before contributing pull requests to the Oskari project.

## Copyright and license

Copyright 2014 - present NLS under dual license MIT (included LICENSE.md) and [EUPL v1.1](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl)
(any language version applies, English version is included in https://github.com/oskariorg/oskari-docs/blob/master/documents/LICENSE-EUPL.pdf).
