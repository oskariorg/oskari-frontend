/**
 * @class Oskari.catalogue.bundle.metadataflyout.Tile
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Tile',

    /**
     * @method create called automatically on construction
     * @static
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

        getOptions: function () {},

        setState: function (state) {
            this.state = state;
        },

        refresh: function () {}
    }, {
        'protocol': ['Oskari.userinterface.Tile']
    });
