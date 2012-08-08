SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../../applications/karttatiili.fi-default/bundle/main"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Apr 17 2012 15:31:23 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Apr 17 2012 15:31:23 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "instance.js" >> build/yui-pack.js
type "..\..\..\..\bundles\framework\bundle\mapfull\enhancement\start-map-with-link-enhancement.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "../../applications/karttatiili.fi-default/bundle/layers"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Tue Apr 17 2012 15:31:23 GMT+0300 (Suomen kesäaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Tue Apr 17 2012 15:31:23 GMT+0300 (Suomen kesäaika)) */ > build/yui-pack.js
type "layers.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd