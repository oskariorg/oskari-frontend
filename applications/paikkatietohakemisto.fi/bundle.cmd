SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../../packages/openlayers/bundle/openlayers-map-full"
md build
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/openlayers/bundle/openlayers-default-theme"
md build
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/event-map"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\features-available-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\features-get-info-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-map-layer-add-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-map-layer-remove-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-get-feature-info-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-map-move-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-map-move-start-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-show-map-layer-info-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-disable-map-keyboard-movement-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-enable-map-keyboard-movement-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-hide-map-marker-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\mouse-hover-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\action\action-statuses-changed-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\MapLayerEvent.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/sandbox-map"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\sandbox\sandbox-map-layer-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\sandbox\sandbox-map-methods.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/service-map"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\service\usage-sniffer-service.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\service\get-feature-info-service.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\service\map-layer-service.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\service\search-service.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/sandbox-base"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\sandbox\sandbox.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\sandbox\sandbox-key-listener-methods.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/request-map"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\disable-map-keyboard-movement-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\enable-map-keyboard-movement-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\add-map-layer-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\remove-map-layer-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\get-feature-info-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\map-move-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\show-map-layer-info-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\hide-map-marker-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\ctrl-key-down-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\ctrl-key-up-request.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/core-map"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-feature-info-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-map-layer-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-map-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-status-methods.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/domain"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wmslayer.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wfslayer.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\vectorlayer.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\map.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\style.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\polygon.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\tooltip.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wizard-options.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wizard-step.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wfs-tile-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\wfs-grid-scheduled-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\QueuedTile.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\TileQueue.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\domain\user.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/request-base"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\request\request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\action\action-ready-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\action\action-start-request.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/core-base"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\core\core.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-build-domain-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-enhancement-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-language-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\core-key-listener-methods.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\event\CoreInitFinishedEvent.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\event\CoreReadyEvent.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\core\event\ToolSelectedEvent.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/mapfull"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-configurations-enhancement.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-link-enhancement.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-search-result-enhancement.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/event-base"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\event\event.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/mapmodule-plugin"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\ui\module\map-module.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\Plugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\ControlsPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\PorttiKeyboard.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\PorttiZoomBar.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\PorttiDragPan.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\PorttiDrag.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\PorttiMouse.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\show-map-measurement-request.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\getinfo\GetInfoAdapter.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\getinfo\GetFeatureInfoHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\getinfo\GetInfoPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\sketchlayer\SketchLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\tilesgrid\QueuedTilesGrid.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\tilesgrid\QueuedTilesStrategy.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\tilesgrid\TilesGridPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\markers\MarkersPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\search\SearchPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\indexmap\IndexMapPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\scalebar\ScaleBarPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\layers\LayersPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapLayerVisibilityRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapLayerVisibilityRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapMoveByLayerContentRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapMoveByLayerContentRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\event\MapLayerVisibilityChangedEvent.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\wmslayer\WmsLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\wmslayer\SnappyGrid.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\wfslayer\WfsLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\vectorlayer\VectorLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\ToolSelectionRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\ToolSelectionHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapLayerUpdateRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapLayerUpdateRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\MapMoveRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\event\MapClickedEvent.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\event\EscPressedEvent.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\request\ClearHistoryRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\controls\ClearHistoryHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\zoombar\Portti2Zoombar.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\plugin\panbuttons\PanButtons.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\locale\fi.js" >> build/yui-pack-locale-fi.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\locale\sv.js" >> build/yui-pack-locale-sv.js
type "..\..\..\..\bundles\framework\bundle\mapmodule-plugin\locale\en.js" >> build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/request-map-layer"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\rearrange-selected-map-layer-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\change-map-layer-opacity-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\change-map-layer-style-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\highlight-map-layer-request.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\request\common\dim-map-layer-request.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/runtime"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\runtime\util.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/event-map-layer"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-rearrange-selected-map-layer-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-change-map-layer-opacity-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-change-map-layer-style-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-highlight-map-layer-event.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\event\common\after-dim-map-layer-event.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/common"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\common\enhancement\disable-development-mode-enhancement.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\common\enhancement\set-default-map-control-active-enhancement.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\common\enhancement\openlayers-image-path-enhancement.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/service-base"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\service\service.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\service\language-service.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/mapwmts"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\plugin\wmtslayer\WmtsLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\domain\WmtsLayer.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\service\WmtsLayerService.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\service\WmtsLayerModelBuilder.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\format\WMTS_1_0_0_capabilities.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapwmts\layer\WMTS.js" >> build/yui-pack.js
type "instance.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/service-map-full"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\sources\framework\service\ogc-search-service.js" >> build/yui-pack.js
type "..\..\..\..\sources\framework\service\net-service-center-service.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/divmanazer"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\AddExtensionRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\AddExtensionRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\RemoveExtensionRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\RemoveExtensionRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\UpdateExtensionRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\UpdateExtensionRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\ModalDialogRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\request\ModalDialogRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\event\ExtensionUpdatedEvent.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\component\Accordion.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\component\AccordionPanel.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\component\Badge.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\component\Alert.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\divmanazer\component\Popover.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/toolbar"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\button-methods.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\default-buttons.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\request\AddToolButtonRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\request\RemoveToolButtonRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\request\ToolButtonStateRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\toolbar\request\ToolButtonRequestHandler.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/statehandler"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\libraries\jquery\plugins\jquery.simplemodal.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\state-methods.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\plugin\Plugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\plugin\SaveViewPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\request\SetStateRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\request\SetStateRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\event\StateSavedEvent.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\request\SaveStateRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\statehandler\request\SaveStateRequestHandler.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
type "..\..\..\..\bundles\framework\bundle\statehandler\locale\fi.js" >> build/yui-pack-locale-fi.js
type "..\..\..\..\bundles\framework\bundle\statehandler\locale\sv.js" >> build/yui-pack-locale-sv.js
type "..\..\..\..\bundles\framework\bundle\statehandler\locale\en.js" >> build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/coordinatedisplay"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\coordinatedisplay\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\coordinatedisplay\div.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/search"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\search\service\searchservice.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\search\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\search\Flyout.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\search\Tile.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
type "..\..\..\..\bundles\framework\bundle\search\locale\fi.js" >> build/yui-pack-locale-fi.js
type "..\..\..\..\bundles\framework\bundle\search\locale\sv.js" >> build/yui-pack-locale-sv.js
type "..\..\..\..\bundles\framework\bundle\search\locale\en.js" >> build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/layerselection2"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\Flyout.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\Tile.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\locale\fi.js" >> build/yui-pack-locale-fi.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\locale\sv.js" >> build/yui-pack-locale-sv.js
type "..\..\..\..\bundles\framework\bundle\layerselection2\locale\en.js" >> build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/layerselector2"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\libraries\rightjs\javascripts\right\tooltips.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\Flyout.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\Tile.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\locale\fi.js" >> build/yui-pack-locale-fi.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\locale\sv.js" >> build/yui-pack-locale-sv.js
type "..\..\..\..\bundles\framework\bundle\layerselector2\locale\en.js" >> build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/infobox"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\plugin\openlayerspopup\OpenlayersPopupPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\request\ShowInfoBoxRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\request\ShowInfoBoxRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\request\HideInfoBoxRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\infobox\request\HideInfoBoxRequestHandler.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/catalogue/bundle/metadataflyout"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\service\MetadataLoader.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\Flyout.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\Tile.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\request\ShowMetadataRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\request\ShowMetadataRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\plugin\MetadataLayerPlugin.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\locale\fi.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\locale\en.js" >> build/yui-pack.js
type "..\..\..\..\bundles\catalogue\bundle\metadataflyout\locale\sv.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
pushd "../../packages/framework/bundle/userguide"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\request\ShowUserGuideRequest.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\request\ShowUserGuideRequestHandler.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\service\UserGuideService.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\Tile.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\locale\fi.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\locale\sv.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\userguide\locale\en.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-fi.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-sv.js
echo /* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack-locale-en.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-fi.js >> build/yui-locale-fi.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-sv.js >> build/yui-locale-sv.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-en.js >> build/yui-locale-en.js
popd
md build
echo /* This is a packed Oskari app (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-app.js
type "..\..\packages\openlayers\bundle\openlayers-map-full\build\yui.js" >> build/yui-app.js
type "..\..\packages\openlayers\bundle\openlayers-default-theme\build\yui.js" >> build/yui-app.js
type "..\..\packages\tools\bundle\yui\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\event-map\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\sandbox-map\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\service-map\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\sandbox-base\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\request-map\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\core-map\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\domain\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\request-base\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\core-base\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\mapfull\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\event-base\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\mapmodule-plugin\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\request-map-layer\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\runtime\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\event-map-layer\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\common\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\service-base\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\mapwmts\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\service-map-full\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\divmanazer\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\toolbar\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\statehandler\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\coordinatedisplay\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\search\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\layerselection2\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\layerselector2\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\infobox\build\yui.js" >> build/yui-app.js
type "..\..\packages\catalogue\bundle\metadataflyout\build\yui.js" >> build/yui-app.js
type "..\..\packages\framework\bundle\userguide\build\yui.js" >> build/yui-app.js
echo /* This is a packed Oskari locale for app (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-app-locale-fi.js
type "..\..\packages\openlayers\bundle\openlayers-map-full\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\openlayers\bundle\openlayers-default-theme\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\tools\bundle\yui\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\event-map\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\sandbox-map\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\service-map\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\sandbox-base\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\request-map\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\core-map\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\domain\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\request-base\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\core-base\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\mapfull\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\event-base\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\mapmodule-plugin\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\request-map-layer\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\runtime\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\event-map-layer\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\common\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\service-base\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\mapwmts\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\service-map-full\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\divmanazer\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\toolbar\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\statehandler\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\coordinatedisplay\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\search\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\layerselection2\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\layerselector2\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\infobox\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\catalogue\bundle\metadataflyout\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
type "..\..\packages\framework\bundle\userguide\build\yui-locale-fi.js" >> build/yui-app-locale-fi.js
echo /* This is a packed Oskari locale for app (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-app-locale-sv.js
type "..\..\packages\openlayers\bundle\openlayers-map-full\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\openlayers\bundle\openlayers-default-theme\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\tools\bundle\yui\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\event-map\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\sandbox-map\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\service-map\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\sandbox-base\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\request-map\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\core-map\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\domain\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\request-base\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\core-base\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\mapfull\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\event-base\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\mapmodule-plugin\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\request-map-layer\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\runtime\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\event-map-layer\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\common\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\service-base\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\mapwmts\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\service-map-full\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\divmanazer\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\toolbar\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\statehandler\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\coordinatedisplay\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\search\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\layerselection2\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\layerselector2\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\infobox\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\catalogue\bundle\metadataflyout\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
type "..\..\packages\framework\bundle\userguide\build\yui-locale-sv.js" >> build/yui-app-locale-sv.js
echo /* This is a packed Oskari locale for app (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ > build/yui-app-locale-en.js
type "..\..\packages\openlayers\bundle\openlayers-map-full\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\openlayers\bundle\openlayers-default-theme\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\tools\bundle\yui\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\event-map\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\sandbox-map\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\service-map\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\sandbox-base\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\request-map\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\core-map\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\domain\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\request-base\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\core-base\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\mapfull\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\event-base\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\mapmodule-plugin\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\request-map-layer\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\runtime\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\event-map-layer\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\common\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\service-base\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\mapwmts\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\service-map-full\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\divmanazer\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\toolbar\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\statehandler\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\coordinatedisplay\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\search\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\layerselection2\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\layerselector2\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\infobox\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\catalogue\bundle\metadataflyout\build\yui-locale-en.js" >> build/yui-app-locale-en.js
type "..\..\packages\framework\bundle\userguide\build\yui-locale-en.js" >> build/yui-app-locale-en.js