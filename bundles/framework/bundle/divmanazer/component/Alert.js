/**
 * @class Oskari.userinterface.component.Bubble
 *
 * Closable erikseen
 *
 */
Oskari.clazz.define('Oskari.userinterface.component.Alert',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function () {
        this.compiledTemplates = {};
        this.compileTemplates();
        this.ui = null;
        this.container = null;
    }, {
        templates: {
            "default": '<div class="oskari-alert"><div class="oskari-alert-icon-close"><div class="icon-close"></div></div></div>',
            "success": '<div class="oskari-alert oskari-alert-success"><div class="oskari-alert-icon-close"><div class="icon-close"></div></div></div>',
            "error": '<div class="oskari-alert oskari-alert-error"><div class="oskari-alert-icon-close"><div class="icon-close"></div></div></div>',
            "info": '<div class="oskari-alert oskari-alert-info"><div class="oskari-alert-icon-close"><div class="icon-close"></div></div></div>'
        },
        compileTemplates: function () {
            var p;
            for (p in this.templates) {
                if (this.templates.hasOwnProperty(p)) {
                    this.compiledTemplates[p] = jQuery(this.templates[p]);
                }
            }
        },
        insertTo: function (container) {
            this.container = container;
        },
        setContent: function (pContent, status, excludeCloseButton) {
            if (this.ui) {
                this.ui.remove();
                this.ui = null;
            }
            var me = this,
                txtdiv = me.compiledTemplates[status || 'default'].clone(),
                includeCloseButton = !excludeCloseButton;
            txtdiv.append(pContent);
            me.container.prepend(txtdiv);
            me.ui = txtdiv;

            if (includeCloseButton) {
                txtdiv.children('.oskari-alert-icon-close').click(function () {
                    me.hide();
                });
            } else {
                txtdiv.children('.oskari-alert-icon-close').remove();
            }
        },
        hide: function () {
            if (this.ui) {
                this.ui.remove();
                this.ui = null;
            }

        }
    });