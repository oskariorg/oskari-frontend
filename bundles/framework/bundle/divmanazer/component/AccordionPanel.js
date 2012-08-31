/**
 * @class Oskari.userinterface.component.AccordionPanel
 * 
 * Panel that can be added to Oskari.userinterface.component.Accordion.
 * TODO: close/open methods?
 */
Oskari.clazz.define('Oskari.userinterface.component.AccordionPanel',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.template = jQuery('<div class="accordion_panel">' + 
               '<div class="header">' +
	               '<div class="headerIcon icon-arrow-right">' +
	               '</div>' + 
	               '<div class="headerText">' +
	               '</div>' + 
               '</div>' + 
               '<div class="content">' +
               '</div>' +
        '</div>');
    this.title = null;
    this.content = null;
    this.html=this.template.clone();
    
    var me = this;
    var header = this.html.find('div.header'); 
    header.click(function() {
    	if(me.isOpen()) {
    		me.close();
    	}
    	else {
    		me.open();
    	}
    });
    this.html.find('div.content').hide();
}, {
    /**
     * @method isOpen
     * Returns true if panel is currently open
     * @return 
     */
    isOpen : function() {
        return this.html.hasClass('open');
    },
    /**
     * @method open
     * Opens the panel programmatically
     */
    open : function() {
        this.html.addClass('open');
        var header = this.html.find('div.header div.headerIcon'); 
        header.removeClass('icon-arrow-right');
		header.addClass('icon-arrow-down');
        this.html.find('div.content').show();
    },
    /**
     * @method close
     * Closes the panel programmatically
     */
    close : function() {
        this.html.removeClass('open');
        var header = this.html.find('div.header div.headerIcon');
		header.removeClass('icon-arrow-down'); 
        header.addClass('icon-arrow-right');
        this.html.find('div.content').hide();
    },
    /**
     * @method setTitle
     * Sets the panel title
     * @param {String} pTitle title for the panel
     */
    setTitle : function(pTitle) {
        this.title = pTitle;
        var header = this.html.find('div.header div.headerText'); 
        header.append(this.title);
    },
    /**
     * @method setContent
     * Sets the panel content. 
     * This can be also done with #getContainer()
     * @param {jQuery} pContent reference to DOM element
     */
    setContent : function(pContent) {
        this.content = pContent;
        var content = this.html.find('div.content'); 
        content.append(this.content);
    },
    /**
     * @method destroy
     * Destroys the panel/removes it from document
     */
    destroy : function() {
        this.html.remove();
    },
    /**
     * @method getContainer
     * Returns this panels content container which can be populated. 
     * This can be also done with #setContent().
     * @return {jQuery} reference to this panels content DOM element
     */
    getContainer : function() {
        return this.html.find('div.content');
    },

    /**
     * @method insertTo
     * Adds this panel to given container.
     * Usually used by Oskari.userinterface.component.Accordion internally.
     * @param {jQuery} container reference to DOM element
     */
    insertTo : function(container) {
        container.append(this.html);
    }
});
