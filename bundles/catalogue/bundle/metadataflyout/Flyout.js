/**
 * @class Oskari.catalogue.bundle.metadataflyout.Flyout
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork to view.MetadataPage containers
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */

    function (instance, locale) {

        /* @property instance bundle instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* @property container the DIV element */
        this.container = null;

        this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

        /* @property accordion */
        this.accordion = null;
        this.pages = {};

    }, {
        getName: function () {
            return 'Oskari.catalogue.bundle.metadataflyout.Flyout';
        },
        setEl: function (el, width, height) {
            this.container = jQuery(el);
        },
        startPlugin: function () {
            var me = this;
            var locale = me.locale;
            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            me.accordion = accordion;

            accordion.insertTo(me.container);

        },
        stopPlugin: function () {
            var p;
            for (p in this.pages) {
                if (this.pages.hasOwnProperty(p)) {
                    this.pages[p].destroy();
                    delete this.pages[p];
                }
            }
            this.container.empty();
        },
        getTitle: function () {
            return this.locale.title;
        },
        getDescription: function () {

        },
        getOptions: function () {

        },
        setState: function (state) {
            this.state = state;

        },
        /**
         * @method scheduleShowMetadata
         *
         * this 'schedules' asyncronous loading
         */
        scheduleShowMetadata: function (allMetadata) {

            var accordion = this.accordion,
                p,
                pageInfo,
                n,
                data,
                page,
                panel;
                
            for (p in this.pages) {
                if (this.pages.hasOwnProperty(p)) {
                    pageInfo = this.pages[p];
                    if (pageInfo) {
                        this.pages[p] = null;
                        pageInfo.page.destroy();
                        accordion.removePanel(pageInfo.panel);
                    }
                }
            }

            for (n = 0; n < allMetadata.length; n++) {
                data = allMetadata[n];
                page = Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.view.MetadataPage', this.instance, this.locale);
                page.init();
                panel = page.getPanel();
                accordion.addPanel(panel);
                if (n === 0) {
                    panel.open();
                }
                this.pages[data.uuid || (data.RS_Identifier_CodeSpace + ":" + data.RS_Identifier_Code)] = {
                    page: page,
                    panel: panel,
                    data: data
                };
            }

            for (p in this.pages) {
                if (this.pages.hasOwnProperty(p)) {
                    pageInfo = this.pages[p];
                    if (pageInfo) {
                        data = pageInfo.data;
                        page = pageInfo.page;
                        page.scheduleShowMetadata(data.uuid, data.RS_Identifier_Code, data.RS_Identifier_CodeSpace);
                    }
                }
            }
        },
        /**
         * @method setContentState
         
         * restore state from store
         */
        setContentState: function (contentState) {
            this.contentState = contentState;

        },
        /**
         * @method getContentState
         *
         * get state for store
         */
        getContentState: function () {
            return this.contentState;
        },
        resetContentState: function () {
            this.contentState = {};
        }
    }, {
        'protocol': ['Oskari.userinterface.Flyout']
    });