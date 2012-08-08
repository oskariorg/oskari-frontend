SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Dec 08 2011 10:08:11 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
pushd "bundle/bundlemanager"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Dec 08 2011 10:08:11 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "bundle/userinterface"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Dec 08 2011 10:08:11 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/map-full-ui-manager.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/map-full-ui-facade.js >> build/yui.js
popd
pushd "bundle/layerselection"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Dec 08 2011 10:08:11 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/module/selected-layers-module.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd