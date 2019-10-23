/*
 * @class Oskari.mapframework.bundle.layerlist.Tile
 *
 * Renders the "map layers" tile.
 */
const BasicTile = Oskari.clazz.get('Oskari.userinterface.extension.DefaultTile');

Oskari.clazz.defineES('Oskari.mapframework.bundle.layerlist.Tile',
    class LayerListTile extends BasicTile {
        constructor (instance) {
            super();
            this.instance = instance;
            this.container = null;
            this.template = null;
            this.shownLayerCount = null;
        }
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName () {
            return 'Oskari.mapframework.bundle.layerlist.Tile';
        }
        /**
         * @method startPlugin
         * Interface method implementation, calls #refresh()
         */
        startPlugin () {
            this._addTileStyleClasses();
            this.refresh();
        }
        _addTileStyleClasses () {
            const isContainer = !!((this.container && this.instance.mediator));
            const isBundleId = !!((isContainer && this.instance.mediator.bundleId));
            const isInstanceId = !!((isContainer && this.instance.mediator.instanceId));

            if (isInstanceId && !this.container.hasClass(this.instance.mediator.instanceId)) {
                this.container.addClass(this.instance.mediator.instanceId);
            }
            if (isBundleId && !this.container.hasClass(this.instance.mediator.bundleId)) {
                this.container.addClass(this.instance.mediator.bundleId);
            }
        }
        /**
         * @method getTitle
         * @return {String} localized text for the title of the tile
         */
        getTitle () {
            return this.instance.getLocalization('title');
        }
        /**
         * @method getDescription
         * @return {String} localized text for the description of the tile
         */
        getDescription () {
            return this.instance.getLocalization('desc');
        }
        notifyUser () {
            const status = this.container.children('.oskari-tile-status');
            status.stop();
            this._blink(status);
        }
        _blink (element) {
            if (!element) {
                return;
            }
            element.removeClass('blink').addClass('blink');
            setTimeout(function () {
                element.removeClass('blink');
            }, 3000);
        }
        refresh () {
            const instance = this.instance;

            const sandbox = instance.getSandbox();
            const layerCount = sandbox.findAllSelectedMapLayers().length;

            const status = this.container.children('.oskari-tile-status');
            status.addClass('icon-bubble-right');
            status.html(layerCount);

            this.notifyUser();
        }
    }
);
