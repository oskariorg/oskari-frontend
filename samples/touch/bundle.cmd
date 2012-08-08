SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Nov 14 2011 10:03:35 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
pushd "bundle/touch"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Nov 14 2011 10:03:35 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
popd
pushd "bundle/layers"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Mon Nov 14 2011 10:03:35 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js layers.js >> build/yui.js
popd