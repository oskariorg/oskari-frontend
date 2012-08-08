SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/layers"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js layers.js >> build/yui.js
popd
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
pushd "bundle/legacy"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js app.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/akp-ui-manager.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui/manager/akp-ui-facade.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "bundle/mapplet"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js Mapplet.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js applet_kutsuu.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js event/MappletStateChanged.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "../example-bundles/bundle/overview"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd
pushd "../quickstartguide/bundle/wikipedia"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Jan 10 2012 13:14:39 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ui.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js instance.js >> build/yui.js
popd