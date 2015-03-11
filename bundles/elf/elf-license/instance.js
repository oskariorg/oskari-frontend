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
    this.licenseService = null;
    this._templates = {
        licenseDialog: jQuery('<div class="elf_license_dialog">' +
            '   <div class="elf_license_dialog_name"></div>' +
            '   <div class="elf_license_dialog_license_data">' +
            '      <div class="elf_license_dialog_description"></div>' +
            '      <div class="elf_license_dialog_licensemodels">' +
            '           <div class="elf_license_dialog_licensemodels_title"></div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="elf_license_dialog_license_details">' +
            '   </div>' +
            '</div>'),
        licenseModel: jQuery('<div class="elf_license_model">' +
            '<div class="elf_license_model_headers">' +
                '<div class="elf_license_model_arrow icon-arrow-right"></div>' +
                '<div class="elf_license_model_name"></div>' +
                '<div class="elf_license_model_description"></div>' +
            '</div>' +
            '</div>'),
        licenceModelDetails: jQuery('<div class="license_basic_data">' +
                '<div class="elf_name"></div>'+
            '</div>'+
            '<div class="license_user_data">'+
            '<table class="elf_license_user_data_table"></table>' +
            '</div>'),
        licenseUserData: jQuery('<tr><td class="elf_license_user_data_label"></td><td class="elf_license_user_data"></td></tr>'),
        licenseInput: jQuery('<div class="elf_license_input"></div>')
    };
    this._dialogStep = null;
    this._validator = {
        number: null
    };
    this._metadata = null;
    this._paramEnumElement = null;
    this._paramDisplayElement = null;
    this._paramIntElement = null;
    this._paramTextElement = null;
    this._paramBlnElement = null;
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

        // Create validators
        this._validator.number = Oskari.clazz.create('Oskari.elf.license.validator.NumberValidator',this, false, true);
        
        // Create elements
        this._paramEnumElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamEnumElement', this, this._validator);
        this._paramDisplayElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamDisplayElement', this, this._validator);
        this._paramIntElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamIntElement', this, this._validator);
        this._paramTextElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamTextElement', this, this._validator);
        this._paramBlnElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamBlnElement', this, this._validator);
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
            me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
        });
    },
    /**
     * Get price
     * @method _getPrice
     * @private
     * 
     * @param {Object} metadata metadata information
     */
    _getPrice: function() {
        var me = this,
            data = me._getLicenseInputValues();
        me.licenseService.doGetPrice({
            data: data,
            id: jQuery('.license_basic_data').attr('data-id'),
            modelid: jQuery('.license_basic_data').attr('data-model-id')
        }, function (response) {
            /*
            if (response) {
                me._showLicenseInformationDialog(response, metadata);
            } else {
                me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            }
            */
        }, function () {
            /*
            me.getSandbox().printWarn('ELF license search failed', [].slice.call(arguments));
            me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            */
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
            prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            models = dialogContent.find('.elf_license_dialog_licensemodels'),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
            metadataTitle = '';

        me._showLicenseModels();
        me._metadata = metadata;

        prevBtn.addClass('elf_license_previous_button');
        prevBtn.setTitle(me._locale.buttons.previous);
        prevBtn.setHandler(function(){
            me._goBack();
        });

        nextBtn.addClass('elf_license_next_button');
        nextBtn.setTitle(me._locale.buttons.next);
        nextBtn.setHandler(function(){
            me._goNext();
        });

        dialog.addClass('elf_license_dialog');
        dialogContent.find('.elf_license_dialog_name').html(data.name);
        dialogContent.find('.elf_license_dialog_description').html(data.description);

        title.removeClass('text');

        // If  founded models then shows them
        if(data.licenseModels.length > 0)  { 
            title.html(me._locale.dialog.licenseModelsTitle);
            jQuery.each(data.licenseModels, function(index, model){
                var modelEl = me._templates.licenseModel.clone();
                modelEl.bind('click', function(){
                    me._showLicenseParams(model, data);
                });

                modelEl.find('.elf_license_model_name').html(model.name);
                modelEl.find('.elf_license_model_description').html(model.description);
                models.append(modelEl);
            });
        }
        // If not found then shows message
        else {
            title.addClass('text');
            // If user has already logged in  then shows at no right to anyone license
            if (me._sandbox.getUser().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            } 
            // Else if user has not logged in then show log in message
            else {
                title.html(me._locale.dialog.loginShort);
            }
        }


        metadataTitle = metadata.name;
        if(metadata.organization && metadata.organization !== null && metadata.organization !== ''){
            metadataTitle += ', ' + metadata.organization;
        }

        dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [prevBtn, cancelBtn, nextBtn]);
        dialog.makeModal();
    },
    /**
     * Go back
     * @method _goBack
     * @private
     */
    _goBack: function(){
        var me = this;
        if(me._dialogStep === null) return;
        if(me._dialogStep === 'step2') {
            me._showLicenseModels();
        }
    },
    /**
     * Go next
     * @method _goNext
     * @private
     */
    _goNext: function(){
        var me = this;
        if(me._dialogStep === null) return;

        if(me._dialogStep === 'step2') {
            me._getPrice();            
        }

    },
    /**
     * Hide previous button
     * @method _hidePreviousButton
     * @private
     */
    _hidePreviousButton: function(){
        jQuery('.elf_license_previous_button').hide();
    },
    /**
     * Show previous button
     * @method _showPreviousButton
     * @private
     */
    _showPreviousButton: function(){
        jQuery('.elf_license_previous_button').show();
    },
    /**
     * Hide next button
     * @method _hideNextButton
     * @private
     */
    _hideNextButton: function(){
        jQuery('.elf_license_next_button').hide();
    },
    /**
     * Show next button
     * @method _showNextButton
     * @private
     */
    _showNextButton: function(){
        jQuery('.elf_license_next_button').show();
    },
    /**
     * Check buttons visibility
     * @method _checkButtonsVisibility
     * @private
     */
    _checkButtonsVisibility: function(){
        var me = this;
        if (me._dialogStep === null || me._dialogStep === 'step1') {
            me._hidePreviousButton();
            me._hideNextButton();
        } else {
            me._showPreviousButton();
            me._showNextButton();
        }
    },
    /**
     * Shows license models.
     * @method _showLicenseModels
     * @private
     */
    _showLicenseModels: function(){
        var me = this;
        me._dialogStep = 'step1';
        jQuery('.elf_license_dialog_license_details').hide();
        jQuery('.elf_license_dialog_license_data').show();
        me._checkButtonsVisibility();
    },
    /**
     * Shows license details.
     * @method _showLicenseDetails
     * @private
     */
    _showLicenseDetails: function(){
        var me = this;
        me._dialogStep = 'step2';
        jQuery('.elf_license_dialog_license_details').show();
        jQuery('.elf_license_dialog_license_data').hide();
        me._checkButtonsVisibility();
    },
     /**
     * Show license information params
     * @method _showLicenseParams
     * @private
     *
     * @param {Object} model license model
     * @param {Object} licenseData license data
     */
    _showLicenseParams: function(model, licenseData) {
        var me = this,
            modelDetails = me._templates.licenceModelDetails.clone(),
            userData = modelDetails.find('.license_user_data'),
            licenseDetails = jQuery('.elf_license_dialog_license_details');

        me._showLicenseDetails();
        licenseDetails.empty();

        modelDetails.find('.elf_name').html(model.name);
        modelDetails.attr('data-model-id', model.id);
        modelDetails.attr('data-id', licenseData.id);

        if(model.params.length>0) {
            var userDataTable = modelDetails.find('.elf_license_user_data_table');
            userData.append(userDataTable);
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param);
                if(jQueryElement !== null) userDataTable.append(jQueryElement);
            });
        }

        licenseDetails.append(modelDetails);
    },
    /**
     * Get form element
     * @method _getFormElement
     * @private
     * 
     * @param {Object} param the license model param
     *
     * @return {Object} jQuery element object
     */
    _getFormElement: function(param, readOnly){
        var me = this,
            element = null,
            type = param.type;

        if (readOnly === null) {
            readOnly = false;
        }

        if (type === 'LicenseParamDisplay') {
            element = me._paramDisplayElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamInt') {
            element = me._paramIntElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamText') {
            element = me._paramTextElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamBln') {
            element = me._paramBlnElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamEnum') {
            element = me._paramEnumElement.getElement(param, readOnly);
        }

        return element;
    },
    /**
     * Get license input values
     * @method
     * @private
     *
     * @return {Object} license values
     */
    _getLicenseInputValues: function(){
        var values = [];
        jQuery('.elf_license_user_data div.elf_license_input').each(function(){
            var element = jQuery(this),
                type = element.attr('data-element-type');

            var value = {
                name: element.attr('data-name'),
                values: []
            };

            var inputValues = null;

            if (type === 'int') {
                inputValues = element.find('input').val();
            } else if (type === 'text') {
                inputValues = element.find('input').val();
            } else if (type === 'boolean') {
                inputValues = element.find('input').is(':checked');
            } else if (type === 'enum') {
                inputValues = [];
                var multi = element.attr('data-element-multi') === 'true';
                element.find('input:checked').each(function(){
                    inputValues.push(jQuery(this).val());
                });
            } else {
                return;
            }


            value.values = inputValues;
            values.push(value);
        });
        return values;
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});