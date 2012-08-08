SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "bundle/bundle"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js ../../../../bundles/bundle.js > build/yui.js
popd
