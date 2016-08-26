/**
 * @class Oskari.integration.bundle.bb.Tile
 */
Oskari.clazz.define('Oskari.integration.bundle.bb.Tile',

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
            return 'Oskari.integration.bundle.bb.Tile';
        },
        setEl: function (el) {
            this.container = $(el);
            if (this.instance && !this.container.hasClass(this.instance.getName())) {
                this.container.addClass(this.instance.getName());
            }
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
                cel = this.container;
        }
    }, {
        'protocol': ['Oskari.userinterface.Tile']
    });