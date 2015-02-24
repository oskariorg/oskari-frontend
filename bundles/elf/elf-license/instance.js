/**
 * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension.
 *
 * @class Oskari.elf.licencse.BundleInstance
 */
Oskari.clazz.define('Oskari.elf.license.BundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    this._sandbox = null;
    this._locale = null;
    this._licenseInformationUrl = null;
    this._templates = {
        licenseDialog: jQuery('<div class="elf_license_dialog">' +
            '<div class="elf_license_dialog_name"></div>' +
            '<div class="elf_license_dialog_description"></div>' +
            '<div class="elf_license_dialog_licensemodels_title"></div>' +
            '<div class="elf_license_dialog_licensemodels"></div>' +
            '</div>'),
        licenseModel: jQuery('<div class="elf_license_model">' +
            '<div class="elf_license_model_headers">' +
                '<div class="elf_license_model_arrow icon-arrow-right"></div>' +
                '<div class="elf_license_model_name"></div>' +
                '<div class="elf_license_model_description"></div>' +
            '</div>' +
            '<div class="elf_license_model_values"></div>' +
            '</div>')
    };
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'elf-license',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    eventHandlers: {
        
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     * 
     * @method afterStart
     */
    afterStart: function (sandbox) {
        var me = this,
            conf = me.conf;
        
        me._locale =  this.getLocalization();
        me._sandbox = sandbox;

        // Activate metadata search results shows licence link
        me._activateMetadataSearchResultsShowLicenseLink();

        if (conf && conf.licenseInformationUrl) {
            me._licenseInformationUrl = conf.licenseInformationUrl;
        } else {
            me._licenseInformationUrl = sandbox.getAjaxUrl() +
                'action_route=ELFLicense';
        }

        // Create the license service
        this.licenseService = Oskari.clazz.create(
                'Oskari.elf.license.service.LicenseService',
                this, this._licenseInformationUrl);
    },
    /**
     * Activate metadata search results show license link
     * @method _activateMetadataSearchResultsShowLicenseLink
     * @private
     */
    _activateMetadataSearchResultsShowLicenseLink: function(){
        var me = this,
            reqBuilder = me._sandbox.getRequestBuilder('AddSearchResultActionRequest');

        if (reqBuilder) {
            var data = {
                actionElement: jQuery('<a href="javascript:void(0)"></a>'),
                callback: function(metadata) {
                    me._getLicenseInfo(metadata);
                },
                bindCallbackTo: null,
                actionTextElement: null,
                actionText: me._locale.getLicenseText,
                showAction: function(metadata) {
                    return metadata.license && metadata.license !== null;
                }
            };
            var request = reqBuilder(data);
            me._sandbox.request(me, request);
        }
    },
    /**
     * Get license information
     * @method _getLicenseInfo
     * @private
     * 
     * @param {Object} metadata metadata information
     */
    _getLicenseInfo: function(metadata) {
        var me = this;

        me.licenseService.doLicenseInformationSearch({
            id: metadata.license
        }, function (response) {
            if (response) {
                me._showLicenseInformationDialog(response, metadata);
            } else {
                me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            }
        }, function () {
            me.getSandbox().printWarn('ELF license search failed', [].slice.call(arguments));
        });
    },
    /**
     * Show message
     * @method _showMessage
     * @private
     *
     * @param {String} title message title
     * @param {String} message the message
     */
    _showMessage: function(title, message) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(title, message);
        dialog.fadeout(5000);
    },
    /**
     * Show license information dialog
     * @method _showLicenseInformationDialog
     * @private
     *
     * @param {Object} data license information data
     * @param {Object} metadata the metadata
     */
    _showLicenseInformationDialog: function(data, metadata){
        var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            dialogContent = me._templates.licenseDialog.clone(),
            cancelBtn = dialog.createCloseButton(me._locale.buttons.close),
            models = dialogContent.find('.elf_license_dialog_licensemodels'),
            metadataTitle = '';

        dialog.addClass('elf_license_dialog');
        dialogContent.find('.elf_license_dialog_name').html(data.name);
        dialogContent.find('.elf_license_dialog_description').html(data.description);
        dialogContent.find('.elf_license_dialog_licensemodels_title').html(me._locale.dialog.licenseModelsTitle);

        jQuery.each(data.licenseModels, function(index, model){
            var modelEl = me._templates.licenseModel.clone();
            modelEl.find('.elf_license_model_name').html(model.name);
            modelEl.find('.elf_license_model_description').html(model.description);
            models.append(modelEl);
        });

        metadataTitle = metadata.name;
        if(metadata.organization && metadata.organization !== null && metadata.organization !== ''){
            metadataTitle += ', ' + metadata.organization;
        }

        dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [cancelBtn]);
        dialog.makeModal();
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});