SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/wmscaps"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/thirdpartymaps"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/terminal"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/sade3"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
type "layermanager.js" >> build/yui-pack.js
type "Sade3App.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Strategy\TileQueue.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Strategy\QueuedTilesGrid.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Strategy\QueuedTilesStrategy.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\GML\ArcInterPoints.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\GML\KTJkiiWFS.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\GML\WFSResponse.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\GML\KTJkiiMappletGML.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\GML\KTJkiiAtp.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Format\WFS\WFSCapabilities.js" >> build/yui-pack.js
type "impl\nlsfi-js-lib\NLSFI\OpenLayers\Filter\LogoFilter.js" >> build/yui-pack.js
type "impl\nlsfi-js-app\NLSFI\Worker\Scheduler.js" >> build/yui-pack.js
type "impl\nlsfi-js-app\NLSFI\Worker\WFSWorker.js" >> build/yui-pack.js
type "impl\sade-js-app\SADE\service\KTJkiiWFS.js" >> build/yui-pack.js
type "impl\sade-js-app\SADE\service\NimistoWFS.js" >> build/yui-pack.js
type "impl\sade-js-app\SADE\service\RakennustiedotWFS.js" >> build/yui-pack.js
type "impl\sade-js-app\SADE\service\MaastoWFS.js" >> build/yui-pack.js
type "mapplet.js" >> build/yui-pack.js
type "worker.js" >> build/yui-pack.js
type "locale.js" >> build/yui-pack.js
type "mediator.js" >> build/yui-pack.js
type "ui\form.js" >> build/yui-pack.js
type "ui\ui.js" >> build/yui-pack.js
type "adapter.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/overview"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/minimal"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/gridcalc"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/bundlemanager"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "ui.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd