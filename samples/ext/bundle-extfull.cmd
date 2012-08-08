SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Feb 09 2012 09:53:43 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
pushd "bundle/extstartup"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Feb 09 2012 09:53:43 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
popd
pushd "bundle/extfull"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Feb 09 2012 09:53:43 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js classes.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalColumn.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalPanel.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalDropZone.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/Portlet.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/statusbar/StatusBar.js >> build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/data/PagingMemoryProxy.js >> build/yui.js
popd