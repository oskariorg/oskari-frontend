![alt text](resources/oskari_logo_rgb_horizontal.svg "Oskari logo")

# Oskari-frontend

[Oskari](https://www.oskari.org/) aims to provide a framework and a collection of functionality-enhancing bundles and plugins for rapid development of feature-rich web map applications.

Documentation available at [https://www.oskari.org].

This repository contains:
- frontend framework code for Oskari-based applications
- `bundles` as building blocks that can be combined to form an Oskari-based application
- Webpack build scripts for building Oskari-based applications.

See our frontend application template on [https://github.com/oskariorg/sample-application] for customizing and building an Oskari-based application.

Developing the frontend framework requires an Oskari-based frontend application and the sample application can be used for this [https://github.com/oskariorg/sample-application/tree/develop/DevelopingOskariFrontend.md].

## Adding icons for generated sprite image (icons.css/icons.png)

1) Install [Graphicsmagick](http://www.graphicsmagick.org/)
2) Add new icons under `resources/icons`
3) Run `npm run sprite base`
4) Commit changes to `resources/icons.css` and `resources/icons.png`

Note! Some of the icons have dark/light versions. This means that different icon is shown when the background is either dark or light for example on the toolbar. Other icons have hover versions that are used for automatically generated hover styles. To use the icon from the sprite it is referenced by the image file name as CSS-class:

```html
    <div class="icon add-area"></div>
```

Note! The same script can be used to generate application-specific overrides. See [sample-application](https://github.com/oskariorg/sample-application) for details.

## Dependencies

Note! All the dependencies (even dev-dependencies like Webpack) are under dependencies for a reason. The reason is that this repository is used as dependency for apps and apps inherit the webpack-dependencies automatically instead of having to install and configure their own versions. We might separate the build tools to another repository in the future that could be used to have alternative versions of build scripts and/or having the build-related dependencies as devDependencies on the application.

# Reporting issues

All Oskari-related issues should be reported here: https://github.com/oskariorg/oskari-documentation/issues

# Contributing

Please read the [contribution guidelines](https://oskari.org/contribute) before contributing pull requests to the Oskari project.

## License
 
This work is dual-licensed under MIT and [EUPL v1.1](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl) 
(any language version applies, English version is included in https://github.com/oskariorg/oskari-docs/blob/master/documents/LICENSE-EUPL.pdf).
You can choose between one of them if you use this work.
 
`SPDX-License-Identifier: MIT OR EUPL-1.1`

Copyright (c) 2014-present National Land Survey of Finland
