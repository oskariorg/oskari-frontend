SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Thu Feb 09 2012 09:53:43 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js yui.js >> build/yui.js
popd
