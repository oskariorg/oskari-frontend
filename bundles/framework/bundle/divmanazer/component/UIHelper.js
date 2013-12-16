/**
 * @class Oskari.userinterface.component.UIHelper
 * Generic UI helper methods
 */
Oskari.clazz.define('Oskari.userinterface.component.UIHelper',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (sandbox) {
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
        processHelpLinks: function (title, content, errorTitle, errorMsg) {
            if (!content) {
                return;
            }
            var me = this,
                getCallback;

            // construct the callback for the button so we can position the popup accordingly
            getCallback = function (btn) {
                return function (isSuccess, pContent) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = dialog.createCloseButton("OK");
                    okBtn.addClass('primary');
                    if (isSuccess) {
                        // help articles have only 'static' content
                        // FIXME static is a reserved word
                        dialog.show(title, pContent.static, [okBtn]);
                        dialog.moveTo(btn, 'bottom');
                    } else {
                        dialog.show(errorTitle, errorMsg, [okBtn]);
                    }
                };
            };
            // Help popups (PORTTISK-812)
            content.find('[helptags]').each(function (i, e) {
                var btn = jQuery(e),
                    taglist = btn.attr("helptags");
                btn.bind('click', function () {
                    me.getHelpArticle(taglist, getCallback(btn));
                });
            });
        },
        /**
         * @method getHelpArticle
         * Fetches an article from the server
         * "helptags" attribute with a popup showing the help article
         * @param {String} taglist - comma-separated list of article tags identifying the article
         * @param {Function} callback - function that is called on completion. Functions first param is
         *   boolean that indicates success, second parameter is the loaded content if it was successfully loaded
         */
        getHelpArticle: function (taglist, callback) {
            var me = this;
            jQuery.ajax({
                url: me.sandbox.getAjaxUrl() + 'action_route=GetArticlesByTag',
                data: {
                    tags: taglist
                },
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (resp) {
                    if (resp && resp.articles[0] && resp.articles[0].content) {
                        callback(true, resp.articles[0].content);
                    } else {
                        callback(false);
                    }
                },
                error: function () {
                    callback(false);
                }
            });
        }
    });
