Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.Flyout',

    function (instance) {
        this.instance = instance;
        // this.loc = Oskari.getMsg.bind(null, 'inspire');
        this.container = null;
        this.flyout = null;
    }, {
        __name: 'Oskari.framework.bundle.admin-layeranalytics.Flyout',
        getName: function () {
            return this.__name;
        },
        getTitle: function () {
            return this.instance.getLocalization('flyout.title');
        },
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
            this.flyout = flyout;
            // this.container.classList.add('inspire');
            // this.flyout.addClass('inspire');
        },
        /**
         * Renders content for flyout UI
         * @method createContent
         */
        createContent: function () {
            const root = this.container;
            if (!root) {
                return;
            }
            // ReactDOM.render(<Message messageKey="flyoutContent.content" allowHTML={true} />, root);
        },
        startPlugin: function () {}
    }
);
