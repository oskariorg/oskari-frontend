# Oskari

[Oskari](https://www.oskari.org/) Map Application Framework aims to provide a framework and a collection of functionality-enhancing bundles and plugins for rapid development of feature-rich GI web applications.

Documentation available at [https://www.oskari.org].

This repository holds the frontend framework code for Oskari. Developing the frontend framework requires a frontend application. You may clone sample frontend application from [https://github.com/oskariorg/sample-application]. The sample application directory should be located next to the frontend framework directory.

You will also need a oskari-server based server webapp to be running that responds to the XHR requests made by the frontend. You can download a pre-compiled copy of the server from [https://www.oskari.org/download]. You may also build it from source by cloning [sample-server-extension](https://github.com/oskariorg/sample-server-extension).

Oskari frontend applications are built using Webpack.

## Preparations

Make sure you have at least Node 16.x / NPM 6.x. You will need both this repository (`oskari-frontend`) and an oskari-based frontend application like the [sample-application](https://github.com/oskariorg/sample-application).

* Run `npm install` in the frontend framework repository root (`oskari-frontend`).
* Run `npm install ../oskari-frontend` in the frontend application repository root (`sample-application`) when developing code on oskari-frontend repository.

Make sure you have an oskari-server based webapp running on localhost port 8080 (can be customized on `webpack.config.js`).

## Run in development

Webpack dev server is used to serve the JS bundle and assets when running in local development. XHR calls will be proxied to the Java backend assumed to be running on localhost:8080.

So that the server knows to look for the JS bundle and assets from the right place, we need to have the client version configured in the Oskari-server `oskari-ext.properties`:

```
oskari.client.version=dist/devapp
```

To start Webpack dev server run `npm run start:dev` on the `sample-application` directory.

When you see "Compiled successfully." in the terminal, you can open the app in the browser at `localhost:8081`.

The dev server has automatic reloading enabled when you save changes to JS code and hot reloading for S/CSS without need for full browser reload.

## Build for production

To build minifed JS and assets run: `npm run build` on the `sample-application` directory (or `npm run build:dev` if you have oskari-frontend installed from `../oskari-frontend` instead of GitHub directly).

This will produce optimized files for production under `sample-application/dist/[version]/geoportal/`. The build scripts are provided in the `oskari-frontend` repository, but are run from the application repository folder. It also defaults to a version from `package.json` of the application repository, but can also be passed on command line.

Note: The version number given for the build command needs to match the client version (`oskari.client.version`) in Oskari-server `oskari-ext.properties`.

Special case: If on your production server your application index.jsp location is mapped to something else than the root (eg. `https://yourdomain.com/my-oskari-app/`), but the assets are mapped relative to the root (eg. `https://yourdomain.com/Oskari/dist/...`), you need to add the build parameter `--env absolutePublicPath=true` like this:

    npm run build -- --env absolutePublicPath=true

## Customizing Oskari

Any customized application should use the [sample-server-extension](https://github.com/oskariorg/sample-server-extension) template as base for customized server and create an app-specific repository for the frontend. 

You can use [sample-application](https://github.com/oskariorg/sample-application) template to create your custom frontend application. See further instructions from the sample application repository.

Run npm `build` and `start` commands in your application repository root.

## Adding icons for generated sprite image (icons.css/icons.png)

1) Install [Graphicsmagick](http://www.graphicsmagick.org/)
2) Add new icons under resources/icons
3) Run `npm run sprite base`
4) Commit changes to resources/icons.css and resources/icons.png

Note! Some of the icons have dark/light versions. This means that different icon is shown when the background is either dark or light for example on the toolbar. Other icons have hover versions that are used for automatically generated hover styles. To use the icon from the sprite it is referenced by the image name as class:

```html
    <div class="icon add-area"></div>
```

Note! The same script can be used to generate application-specific overrides. See [sample-application](https://github.com/oskariorg/sample-application) for details.

## Dependencies

Note! All the dependencies (even dev-dependencies like Webpack) are under dependencies for a reason. The reason is that this repository is used as dependency for apps and apps inherit the webpack-dependencies automatically instead of having to install and configure their own versions. We might separate the build tools to another repository in the future that could be used to have alternative versions of build scripts and/or having the build-related dependencies as devDependencies on the application.

# Reporting issues

All Oskari-related issues should be reported here: https://github.com/oskariorg/oskari-docs/issues

# Contributing

Please read the [contribution guidelines](https://oskari.org/contribute) before contributing pull requests to the Oskari project.

## License
 
This work is dual-licensed under MIT and [EUPL v1.1](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl) 
(any language version applies, English version is included in https://github.com/oskariorg/oskari-docs/blob/master/documents/LICENSE-EUPL.pdf).
You can choose between one of them if you use this work.
 
`SPDX-License-Identifier: MIT OR EUPL-1.1`

Copyright (c) 2014-present National Land Survey of Finland
