/*
 * @class Oskari.framework.bundle.admin-announcements.Tile
 *
 * Renders the "admin-announcements" tile.
 */
const BasicTile = Oskari.clazz.get('Oskari.userinterface.extension.DefaultTile');

Oskari.clazz.defineES('Oskari.framework.bundle.admin-announcements.Tile',
    class LayerListTile extends BasicTile {
        constructor (instance, locale) {
            super();
            this.instance = instance;
            this.locale = locale;
            this.container = null;
            this.template = null;
            this.shownLayerCount = null;
        }
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName () {
            return 'Oskari.framework.bundle.admin-announcements.Tile';
        }
        /**
         * @method startPlugin
         * Interface method implementation, calls #refresh()
         */
        startPlugin () {
            this._addTileStyleClasses();
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
        _blink (element) {
            if (!element) {
                return;
            }
            element.removeClass('blink').addClass('blink');
            setTimeout(function () {
                element.removeClass('blink');
            }, 3000);
        }
    }
);
