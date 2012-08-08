SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/ns960"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/adapt"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
type "app.js" >> build/yui-pack.js
type "ui\manager\adapt-ui-manager.js" >> build/yui-pack.js
type "ui\manager\adapt-ui-facade.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-configurations-enhancement.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-link-enhancement.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/layers"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "layers.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd