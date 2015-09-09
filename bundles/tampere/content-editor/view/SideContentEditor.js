/**
 * @class Oskari.tampere.bundle.content-editor.view.SideContentEditor
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.view.SideContentEditor',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param
     */
    function (instance, localization, data) {
	debugger;
        var me = this;
        me.data = data;

        me.instance = instance;
        me.template = jQuery(
            '<div class="content-editor">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div>');

        me.loc = localization;
        me.mainPanel = null;
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = me.template.clone();
            
            me.mainPanel = content;

            container.append(content);
            $(".icon-close").on('click', function(){
            	me.instance.setEditorMode(false);
            });

            content.find('div.header h3').append(me.loc.title);

            content.find('.content').append($("<div>" + me.loc.featureModifyInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.toolInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.geometryModifyInfo + "</div>"));
            
            //var pointButton = $("<div />").addClass('myplaces-draw-point tool');
            //var lineButton = $("<div />").addClass('myplaces-draw-line tool');
            //var areaButton = $("<div />").addClass('myplaces-draw-area tool');
            
            var pointButton = $("<div />").addClass('add-point tool');
            var lineButton = $("<div />").addClass('add-line tool');
            var areaButton = $("<div />").addClass('add-area tool');
            
            var toolContainer = $("<div />").addClass('toolrow');
            toolContainer.append(pointButton);
            toolContainer.append(lineButton);
            toolContainer.append(areaButton);
            
            content.find('.content').append(toolContainer);

        },

        /**
         * @method destroy
         * Destroys/removes this view from the screen.
         *
         *
         */
        destroy: function () {
            this.mainPanel.remove();
        }
    });
