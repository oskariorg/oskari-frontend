/**
 * @class Oskari.mapframework.bundle.featuredata.PopupHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.PopupHandler', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance} instance
 */
function(instance) {
	this.instance = instance;
	this.localization = instance.getLocalization('popup');

	this.templateContent = jQuery('<div></div>');
	this.templateEditDialogContent = jQuery('<div></div>');

	this.templateEditButtons = jQuery('<div></div>');
	this.templateToolsButton = jQuery('<div style="display: inline-block; border: 1px solid;"></div>');

	this.templateInstructions = jQuery('<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>');

	this.templateLink = jQuery('<div class="link"><a href="JavaScript:void(0);"></a></div>' + '</div>');

	var me = this,
        selectionPlugin = me.instance.getSelectionPlugin();

	me.buttons = {
        'point' : {
            iconCls : 'selection-point',
            tooltip : me.localization.tools.point.tooltip,
            sticky : false,
            callback : function() {
                selectionPlugin.startDrawing({drawMode : 'point'});
            }
        },
        'line' : {
            iconCls : 'selection-line',
            tooltip : me.localization.tools.line.tooltip,
            sticky : false,
            callback : function() {
                selectionPlugin.startDrawing({drawMode : 'line'});
            }
        },
        'polygon' : {
            iconCls : 'selection-area',
            tooltip : me.localization.tools.polygon.tooltip,
            sticky : false,
            callback : function() {
                selectionPlugin.startDrawing({drawMode : 'polygon'});
            }
        },
        'square' : {
            iconCls : 'selection-square',
            tooltip : me.localization.tools.square.tooltip,
            sticky : false,
            callback : function() {
                selectionPlugin.startDrawing({drawMode : 'square'});
            }
        },
        'circle' : {
            iconCls : 'selection-circle',
            tooltip : me.localization.tools.circle.tooltip,
            sticky : false,
            callback : function() {
                selectionPlugin.startDrawing({drawMode : 'circle'});
            }
        }      
    };
}, {
	/**
	 * @method showSelectionTools
	 * Handles tool button click -> opens selection tool dialog
	 */
	showSelectionTools : function() {
        var me = this;

        // close popup so we can update the selection geometry
        // this is done so we can optimize grid updates on normal updateExtensionRequests.
        // if the selection show wouldn't use this request but a custom one, this wouldn't be needed
        me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);

        var closureMagic = function(tool) {
        	return function() {

        		me.buttons[tool].callback();
        		dialog.close();
                me._selectionStarted();
        		
        	};
        };

        //Main dialog
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            popupLoc = this.localization.title,
            content = this.templateContent.clone(),
            buttonName,
            btnContainer,
            button;

        for(buttonName in this.buttons) {
            if (this.buttons.hasOwnProperty(buttonName)) {
            	btnContainer = this.templateToolsButton.clone();
            	button = this.buttons[buttonName];
            	btnContainer.attr('title', button.tooltip);
            	btnContainer.addClass(button.iconCls);
            	btnContainer.bind('click', closureMagic(buttonName));
            	content.append(btnContainer);
            }
        }

        var instructions = this.templateInstructions.clone();
        instructions.append(this.localization.instructions);
        content.append(instructions);

        var cancelBtn = dialog.createCloseButton( this.localization.button.cancel);
        cancelBtn.addClass('primary');

        dialog.addClass('tools_selection');
        dialog.show(popupLoc, content, [cancelBtn]);
        dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');
    },

    /**
    * @method _editDialog
    * This method triggers when the selection starts 
    * @private
    **/
	_selectionStarted : function() {
        var me = this,
            sandbox = me._sandbox,
            editDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            title = me.localization.title,
            dialogContent = me.templateEditDialogContent.clone(),
            templateButtons = me.templateEditButtons.clone(),
            editButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

        editButton.setTitle(me.localization.button.edit);
        editButton.setHandler(function() {
            editDialog.close();
            me.showSelectionTools();
            me.instance.getSelectionPlugin().startDrawing({drawMode : 'modify'});
        });

        templateButtons.append(editButton.getElement());

        var closeButton = editDialog.createCloseButton(me.localization.button.close);
        templateButtons.append(closeButton.getElement());
        closeButton.setHandler(function() {
            editDialog.close();
            me.instance.getSelectionPlugin().stopDrawing();
            me.showSelectionTools();
        });
        dialogContent.append(templateButtons);

        var addMoreLink = me.templateLink.clone();
        addMoreLink.append(me.localization.link.title);
        addMoreLink.bind('click', function() {
            editDialog.close();
            me.showSelectionTools();
        });
        dialogContent.append(addMoreLink);

        // clear selection in instance
        me.instance.setGeometry(null);

        var showSelectionsBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        showSelectionsBtn.setTitle(me.localization.button.show);
        showSelectionsBtn.addClass('primary showSelection');
        showSelectionsBtn.setHandler(function() {
            var features = me.instance.getSelectionPlugin().getFeaturesAsGeoJSON();
            me.instance.setGeometry(features);
            me.instance.getSelectionPlugin().stopDrawing();
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'detach']);
            editDialog.close();             
        });

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(me.localization.button.cancel);
        cancelBtn.setHandler(function() {
            editDialog.close();
            me.instance.getSelectionPlugin().stopDrawing();
        });

        editDialog.show(title, dialogContent, [cancelBtn, showSelectionsBtn]);
        editDialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');
    }
});
