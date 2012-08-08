SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/openlayers-default"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Fri Feb 10 2012 10:24:23 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Fri Feb 10 2012 10:24:23 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "..\..\..\..\map-application-framework\lib\proj4js-1.0.1\lib\proj4js-compressed.js" >> build/yui-pack.js
type "defs.js" >> build/yui-pack.js
type "..\openlayers-build\full\OpenLayers.js" >> build/yui-pack.js
type "hack.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Fri Feb 10 2012 10:24:23 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Fri Feb 10 2012 10:24:23 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd