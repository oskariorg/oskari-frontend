SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/phase-a"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Nov 30 2011 14:02:48 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/proj4js-1.0.1/lib/proj4js-compressed.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/OpenLayers-2.11/OpenLayers.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/log4js-0.31/log4js.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/ext-all.js >> build/yui.js
popd
pushd "bundle/phase-b"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Nov 30 2011 14:02:48 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/proj4js-1.0.1/lib/defs/EPSG3067.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/proj4js-1.0.1/lib/defs/EPSG4326.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalColumn.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalPanel.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalDropZone.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/Portlet.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/statusbar/StatusBar.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/data/PagingMemoryProxy.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js Starter.js >> build/yui.js
popd
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Nov 30 2011 14:02:48 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd