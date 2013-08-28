/**
 * @class Oskari.userinterface.component.TabPanel
 *
 * Panel that can be added to Oskari.userinterface.component.TabContainer.
 * Represents a single tab in tabcontainer.
 */
Oskari.clazz.define('Oskari.userinterface.component.TabPanel',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        "use strict";
        this.template = jQuery('<div class="tab-content"></div>');
        this.templateTabHeader = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
        this.title = null;
        this.content = null;
        this.header = null;
        this.selectionHandler = null;
        this.html = this.template.clone();
        this.html.hide();
    }, {
        /**
         * @method setTitle
         * Sets the panel title
         * @param {String} pTitle title for the panel
         */
        setTitle: function (pTitle) {
            "use strict";
            var header,
                link;
            this.title = pTitle;
            header = this.templateTabHeader.clone();
            this.header = header;
            link = header.find('a');
            link.html(this.getTitle());
        },
        /**
         * @method getTitle
         * Returns the panel title
         * @return {String} title for the panel
         */
        getTitle: function () {
            "use strict";
            return this.title;
        },
        /**
         * @method setHeader
         * @return {jQuery} reference to header DOM element
         * Sets the tabs header DOM element
         */
        setHeader: function (reference) {
            "use strict";
            this.header = reference;
        },
        /**
         * @method getHeader
         * @return {jQuery} reference to DOM element
         * Returns the tabs header DOM element
         */
        getHeader: function () {
            "use strict";
            return this.header;
        },
        /**
         * @method setContent
         * Sets the panel content.
         * This can be also done with #getContainer()
         * @param {jQuery} pContent reference to DOM element
         */
        setContent: function (pContent) {
            "use strict";
            this.content = pContent;
            this.html.html(this.content);
        },
        /**
         * @method destroy
         * Destroys the panel/removes it from document
         */
        destroy: function () {
            "use strict";
            this.header.remove();
            this.html.remove();
        },
        /**
         * @method getContainer
         * Returns this panels content container which can be populated.
         * This can be also done with #setContent().
         * @return {jQuery} reference to this panels content DOM element
         */
        getContainer: function () {
            "use strict";
            return this.html;
        },

        /**
         * @method setSelectionHandler
         * Sets a handler function that is called when the panel is selected or unselected.
         * The function receives a boolean parameter indicating if the panel was selected (true) or unselected(false)
         * @param {Function} pHandler handler function
         */
        setSelectionHandler: function (pHandler) {
            "use strict";
            this.selectionHandler = pHandler;
        },
        /**
         * @method handleSelection
         * @param {Boolean} true if panel was selected, false if unselected
         */
        handleSelection: function (isSelected) {
            "use strict";
            if (this.selectionHandler) {
                this.selectionHandler(isSelected === true);
            }
        },
        /**
         * @method insertTo
         * Adds this panel to given container.
         * Usually used by Oskari.userinterface.component.TabContainer internally.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            "use strict";
            container.append(this.html);
        }
    });
