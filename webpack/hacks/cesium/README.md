`buildModuleUrl.js.modified` is a copy of `node_modules/@cesium/engine/Source/Core/buildModuleUrl.js` and is overwriting the original version with as a postinstall script.

The changes are tagged with `// EDIT START` and `// EDIT END`. 

Commented out part where import.meta?.url is referenced as Webpack 4.x fails to process it with this error:

```sh
ERROR in ../oskari-frontend/node_modules/@cesium/engine/Source/Core/buildModuleUrl.js 42:43
Module parse failed: Unexpected token (42:43)
File was processed with these loaders:
 * ../oskari-frontend/node_modules/babel-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
|   if (typeof CESIUM_BASE_URL !== "undefined") {
|     baseUrlString = CESIUM_BASE_URL;
>   } else if (defined((_import$meta = import.meta) === null || _import$meta === void 0 ? void 0 : _import$meta.url)) {
|     // ESM
|     baseUrlString = getAbsoluteUri(".", import.meta.url);
 @ ../oskari-frontend/node_modules/@cesium/engine/Source/Core/ApproximateTerrainHeights.js 2:0-49 39:35-49
 @ ../oskari-frontend/node_modules/@cesium/engine/index.js
 @ ../oskari-frontend/node_modules/cesium/Source/Cesium.js
 @ ./node_modules/oskari-frontend/bundles/mapping/mapmodule/mapmodule.olcs.js
 @ ../oskari-frontend/webpack/oskariLoader.js!./node_modules/oskari-frontend/packages/mapping/olcs/mapmodule/bundle.js
 @ ./applications/embedded-3D/main.js
 @ multi ../oskari-frontend/webpack/polyfill.js ../oskari-frontend/webpack/oskari-core.js ./applications/embedded-3D/main.js
 ```
