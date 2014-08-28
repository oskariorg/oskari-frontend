/**
 * @class Oskari.catalogue.bundle.metadataflyout.Tile
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Tile',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (instance, locale) {
        this.instance = instance;
        this.locale = locale;
        this.container = null;
        this.template = null;
    }, {
        getName: function () {
            return 'Oskari.catalogue.bundle.metadataflyout.Tile';
        },

        setEl: function (el, width, height) {
            this.container = $(el);
        },

        startPlugin: function () {
            this.refresh();
        },

        stopPlugin: function () {
            this.container.empty();
        },

        getTitle: function () {
            return this.locale.title;
        },

        getDescription: function () {},

        getOptions: function () {

        },

        setState: function (state) {
            this.state = state;
        },

        refresh: function () {
            var me = this,
                instance = me.instance,
                cel = this.container,
                tpl = this.template,
                sandbox = instance.getSandbox();

            /*var status = cel.children('.oskari-tile-status');*/
            /*status.empty();*/

            /*status.append('(' + layers.length + ')');*/

        }
    }, {
        'protocol': ['Oskari.userinterface.Tile']
    });
