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
function() {
    this.template = jQuery('<div class="tab-content"></div>');
    this.templateTabHeader = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
    this.id = null;
    this.title = null;
    this.content = null;
    this.header = null;
    this.selectionHandler = null;
    this.priority = 1.0;
    this.html=this.template.clone();
    this.html.hide();
}, {

    /**
     * @method setId
     * Sets the panel id
     * @param {String} id id for the panel
     */
    setId : function(id) {
    	this.id = id;
    },
    /**
     * @method getId
     * Returns the panel id
     * @return {String} id for the panel
     */
    getId : function() {
        return this.id;
    },

    /**
     * @method setPriority
     * Sets the panel priority
     * @param {Number} priority priority for the panel
     */
    setPriority : function(priority) {
        this.priority = priority;
    },
    /**
     * @method getPriority
     * Returns the panel priority
     * @return {Number} priority for the panel
     */
    getPriority : function() {
        return this.priority;
    },

    /**
     * @method setTitle
     * Sets the panel title
     * @param {String} title title for the panel
     */
    setTitle: function (title, headerElementId) {
        var header,
            link;
        this.title = title;
        header = this.templateTabHeader.clone();
        this.header = header;
        if (headerElementId) {
        	header.attr('id', headerElementId);
        }
        link = header.find('a');
        link.html(this.getTitle());
    },
    /**
     * @method getTitle
     * Returns the panel title
     * @return {String} title for the panel
     */
    getTitle: function () {
        return this.title;
    },
    /**
     * @method setHeader
     * @return {jQuery} reference to header DOM element
     * Sets the tabs header DOM element
     */
    setHeader: function (reference) {
        this.header = reference;
    },
    /**
     * @method getHeader
     * @return {jQuery} reference to DOM element
     * Returns the tabs header DOM element
     */
    getHeader: function () {
        return this.header;
    },
    /**
     * @method setContent
     * Sets the panel content.
     * This can be also done with #getContainer()
     * @param {jQuery} pContent reference to DOM element
     */
    setContent: function (pContent) {
        this.content = pContent;
        this.html.html(this.content);
    },
    /**
     * @method destroy
     * Destroys the panel/removes it from document
     */
    destroy: function () {
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
        return this.html;
    },

    /**
     * @method setSelectionHandler
     * Sets a handler function that is called when the panel is selected or unselected.
     * The function receives a boolean parameter indicating if the panel was selected (true) or unselected(false)
     * @param {Function} pHandler handler function
     */
    setSelectionHandler: function (pHandler) {
        this.selectionHandler = pHandler;
    },
    /**
     * @method handleSelection
     * @param {Boolean} true if panel was selected, false if unselected
     */
    handleSelection: function (isSelected) {
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
        container.append(this.html);
    },

    /**
     * @method insertTo
     * Adds this panel to given container at given location.
     * Usually used by Oskari.userinterface.component.TabContainer internally.
     * @param {jQuery} container reference to DOM element
     * @param {Integer} index array location
     */
    insertAt: function (container, index) {
        if (index === 0) {
            container.prepend(this.html[0]);
        } else {
            container.children().eq(index-1).after(this.html[0]);
        }
    }
});
