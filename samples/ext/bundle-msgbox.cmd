SET CURRENT=%CD%
SET YUICOMPRESSOR=%CURRENT%/"../tools/bundle/yui/yuicompressor-2.4.6.jar"
pushd "../tools/bundle/yui"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "yui.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/extstartup"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd
pushd "bundle/msgbox"
md build
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js bundle.js > build/bundle-yui.js
echo /* This is a packed Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui.js
echo /* This is a unpacked Oskari bundle (bundle script version Fri Feb 10 2012 07:08:45 GMT+0200 (Suomen normaaliaika)) */ > build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ComponentQuery.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Template.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\XTemplateParser.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\IdGenerator.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Operation.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Request.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\ResultSet.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\SortTypes.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Types.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\validations.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\association\Association.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\reader\Reader.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\writer\Writer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Color.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Draw.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Matrix.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\engine\ImageExporter.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\engine\SvgExporter.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\CubicBezier.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\PropertyHandler.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\Target.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\ClassList.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\ContextItem.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Bindable.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\ElementContainer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Filter.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Memento.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Observable.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Offset.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\ProtoElement.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Queue.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Region.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Renderable.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Sorter.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Layer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ShadowPool.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ZIndexManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DragDropManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DragTracker.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\field\Field.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\field\VTypes.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\boxOverflow\None.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\Proxy.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\resizer\Resizer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\resizer\ResizeTracker.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Animate.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\ClickRepeater.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\ComponentDragger.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\CSS.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Floating.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\KeyMap.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\KeyNav.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\TextMetrics.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ElementLoader.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ComponentLoader.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\XTemplateCompiler.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\XTemplate.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Batch.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Connection.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Ajax.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Field.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\reader\Json.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\reader\Array.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\writer\Json.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\proxy\Proxy.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\proxy\Client.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\proxy\Memory.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\proxy\Server.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\Component.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\Element.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\CompositeElement.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\ElementCSS.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\CompositeElementCSS.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\Sprite.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\target\CompositeSprite.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\Layout.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Component.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Auto.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Draw.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\state\Provider.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\state\Manager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\state\Stateful.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\AbstractMixedCollection.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Grouper.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\HashMap.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\AbstractManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ComponentManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\AbstractComponent.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ModelManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\PluginManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\Queue.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Point.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\Sortable.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\util\MixedCollection.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\container\DockingContainer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\AbstractStore.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Errors.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\StoreManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\proxy\Ajax.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Model.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\Store.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\data\ArrayStore.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\CompositeSprite.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Surface.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\Manager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\Animator.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\fx\Anim.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\Context.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Component.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Component.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\FocusManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Img.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\LoadMask.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\Shadow.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DragDrop.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DD.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DDProxy.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\StatusProxy.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\dd\DragSource.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\SpriteDD.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\Sprite.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\engine\Svg.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\draw\engine\Vml.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\Labelable.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Body.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Button.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\Dock.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\ProgressBar.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\ProgressBar.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\field\Field.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\field\Base.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\field\Text.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\field\Text.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\component\field\TextArea.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\form\field\TextArea.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\Container.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\Auto.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\container\AbstractContainer.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\container\Container.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\Anchor.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\Fit.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\boxOverflow\Scroller.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\Item.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\CheckItem.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\KeyNav.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\Manager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\button\Button.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\Separator.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\DD.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\Header.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\toolbar\Fill.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\toolbar\Item.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\toolbar\Separator.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\boxOverflow\Menu.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\Box.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\HBox.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\layout\container\VBox.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\toolbar\Toolbar.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\AbstractPanel.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\Panel.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\menu\Menu.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\tip\Tip.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\tip\ToolTip.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\tip\QuickTip.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\tip\QuickTipManager.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\panel\Tool.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\window\Window.js" >> build/yui-pack.js
type "..\..\..\..\..\sencha\ext-4.1.0-beta-2\src\window\MessageBox.js" >> build/yui-pack.js
java -jar %YUICOMPRESSOR% --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js
popd