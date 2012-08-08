SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
pushd "bundle/wmtsstats"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "bundle/wmts"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/wmts-ui-facade.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "bundle/wmtsmodule"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js plugin/wmtspoc/WmtsPocPlugin.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "bundle/candy-2"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js app.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/sample-ui-facade.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/sample-ui-manager.js >> build/yui.js
popd
pushd "bundle/mapcontrols"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui\module\map-controls-module.js >> build\yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ..\..\..\..\bundles\framework\bundle\mapcontrols\request\ToolButtonRequest.js" >> build\yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ..\..\..\..\bundles\framework\bundle\mapcontrols\request\ToolButtonRequestHandler.js >> build\yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ..\..\..\..\bundles\framework\bundle\mapcontrols\action\GeoAction.js >> build\yui.js
popd
pushd "bundle/layers"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js layers.js >> build/yui.js
popd
pushd "bundle/style1"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
popd
pushd "bundle/style2"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Jan 12 2012 12:28:07 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
popd