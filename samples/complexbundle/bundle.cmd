SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../../packages/tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "../portal/bundle/mapportal"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui\manager\map-portal-ui-manager.js" >> build/yui-pack.js
type "ui\manager\map-portal-ui-facade.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/layerselection"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui\module\selected-layers-module.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/clazzbrowser"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "prettify.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
type "ui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/twitter"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/positioninfo"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/trains"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/wikipedia"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/sample"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/solsol"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "SolitairePlayer.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd