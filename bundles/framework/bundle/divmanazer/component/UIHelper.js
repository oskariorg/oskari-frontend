/**
 * @class Oskari.userinterface.component.UIHelper
 * Generic UI helper methods
 */
Oskari.clazz.define('Oskari.userinterface.component.UIHelper',

/**
 * @method create called automatically on construction
 * @static
 */
function(sandbox) {
	this.sandbox = sandbox;
}, {
    /**
     * @method processHelpLinks
     * Processes given element and binds any element with 
     * "helptags" attribute with a popup showing the help article
     * @param {String} title - help popup title
     * @param {jQuery} content - element to scan
     * @param {String} errorMsg - popup title if help article is not found
     * @param {String} errorMsg - message if help article is not found
     */
    processHelpLinks : function(title, content, errorTitle, errorMsg) {
    	if(!content) {
    		return;
    	}
    	var me = this;
    	
        // construct the callback for the button so we can position the popup accordingly
    	var getCallback = function(btn) {
    	    return function(isSuccess, pContent) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var okBtn = dialog.createCloseButton("OK");
                okBtn.addClass('primary');
        	    if(isSuccess) {
                    dialog.show(title, pContent, [okBtn]);
                    dialog.moveTo(btn, 'bottom');
        	    }
        	    else {
                    dialog.show(errorTitle, errorMsg, [okBtn]);
        	    }
    	   };
    	}
        // Help popups (PORTTISK-812)
        content.find('[helptags]').each(function(i, e) {
            var btn = jQuery(e);
            var taglist = btn.attr("helptags");
            btn.bind('click', function() {
                me.getHelpArticle(taglist, undefined, getCallback(btn));
            });
        });
    },
    /**
     * @method getHelpArticle
     * Fetches an article from the server
     * "helptags" attribute with a popup showing the help article
     * @param {String} taglist - comma-separated list of article tags identifying the article
     * @param {String} contentPart - element name in the article we want (optional)
     * @param {Function} callback - function that is called on completion. Functions first param is 
     *   boolean that indicates success, second parameter is the loaded content if it was successfully loaded 
     */
    getHelpArticle : function(taglist, contentPart, callback) {
        var me = this;
        jQuery.ajax({
            url : me.sandbox.getAjaxUrl() + '&action_route=GetArticlesByTag', //&tags="' + taglist + '"',
            data : {
                part : contentPart,
                tags : taglist
            },
            type : 'GET',
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
                var content = resp.articles[0].content;
                var idx = content.indexOf("<![CDATA[");
                if (idx >= 0) {
                    content = content.substring(idx + 9);
                }
                idx = content.indexOf("]]>");
                if (idx >= 0) {
                    content = content.substring(0, idx);
                }
                callback(true, content);
            },
            error : function() {
                callback(false);
            }
        });
    }
});
