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
    this.prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    this.nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    this._templates = {
        metadataFlyoutLicenseDialog: jQuery('<div class="elf_license_dialog" style="width:100%!important;">' +
            '   <div class="elf_license_dialog_license_data" style="height:auto!important;">' +
            '      <div class="elf_license_dialog_descriptions_title"></div>' +
            '      <div>'+
            '           <ul class="elf_license_dialog_descriptions"></ul>'+
            '      </div>' +
            '</div>'),
        licenseDialog: jQuery('<div class="elf_license_dialog">' +
            '   <div class="elf_license_dialog_license_data">' +
            '      <div class="elf_license_dialog_licensemodels_title"></div>' +
            '      <div class="elf_license_dialog_licensemodels">' +
            '      </div>' +
            '   <div class="help"></div>'+
            '   </div>' +
            '   <div class="elf_license_dialog_license_details">' +
            '   </div>' +
            '   <div class="elf_license_dialog_license_price">' +
            '   </div>' +
            '</div>'),
        licenseModel: jQuery('<div class="elf_license_model">' +
            '   <div class="elf_license_model_headers">' +
            '       <div class="elf_license_model_arrow icon-arrow-right"></div>' +
            '       <div class="elf_license_model_name"></div>' +
            '       <div class="elf_license_model_description"></div>' +
            '   </div>' +
            '</div>'),
        licenceModelDetails: jQuery('<div><div class="license_basic_data">' +
            '   <div class="elf_name"></div>' +
            '</div>' +
            '<div class="license_user_data">' +
            '   <table class="elf_license_user_data_table"></table>' +
            '</div>' +
            '<div class="help"></div></div>'),
        licenceModelUnconcludeDetails: jQuery('<div><div class="license_basic_data">' +
            '   <div class="elf_name"></div>'+
            '   <div class="elf_license_user_info"></div>' +
            '</div>'+
            '<div class="license_user_data">'+
            '   <table class="elf_license_user_data_table"></table>' +
            '</div>' +
            '<div class="license_id"></div>'+
            '<div class="service_url"></div>'+
            '<div class="validto_summary"></div>'+
            '<div class="clear"></div>'+
            '<div class="help"></div></div>'),
        licenceModelSummaryDetails: jQuery('<div><div class="license_basic_data">' +
                '<div class="name"></div>'+
                '<div class="header"></div>'+
            '</div>'+
            '<div class="license_user_data">'+
            '<table class="elf_license_user_data_table"></table>' +
            '</div>'+
            '<div class="price_summary"><span class="title"></span><span class="price"></span></div>'+
            '<div class="clear"></div>'+
            '<div class="help"></div>'+
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
    this._showsMessage = false;
    this._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
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
        me.licenseService = Oskari.clazz.create(
                'Oskari.elf.license.service.LicenseService',
                me, me._licenseInformationUrl);

        // Create validators
        me._validator.number = Oskari.clazz.create('Oskari.elf.license.validator.NumberValidator',me, false, true);

        // Create elements
        me._paramEnumElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamEnumElement', me, me._validator);
        me._paramDisplayElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamDisplayElement', me, me._validator);
        me._paramIntElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamIntElement', me, me._validator);
        me._paramTextElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamTextElement', me, me._validator);
        me._paramBlnElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamBlnElement', me, me._validator);

        this._addLicenseTabToMetadataFlyout();

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
    _addLicenseTabToMetadataFlyout: function() {
        var me = this,
            reqBuilder = me.sandbox.getRequestBuilder('catalogue.AddTabRequest');
        var data = {
            'license': {
                template: null,
                title: me._locale.getLicenseText,
                tabActivatedCallback: function(uuid, panel, metadataModel) {
                    me._getLicenseInfoForMetadataFlyout(metadataModel, panel);
                }
            }
        };

        if (reqBuilder) {
            var request = reqBuilder(data);
            me.sandbox.request(me, request);
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
        me._progressSpinner.insertTo(jQuery('.actionPlaceholder').parents('.oskari-flyoutcontent'));
        me._progressSpinner.start();
        me.licenseService.doLicenseInformationSearch({
            id: metadata.license
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                if(response.userLicense){
                    me._showLicenseDeactivateDialog(response, metadata);
                } else {
                    me._showLicenseSubscriptionInformationDialog(response, metadata);
                }
            } else {
                me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            }
        }, function () {
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license info failed', [].slice.call(arguments));
            me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
        });
    },
    /**
     * Get license information (in search results)
     * @method _getLicenseInfo
     * @private
     *
     * @param {Object} metadata metadata information
     */
    _getLicenseInfoForMetadataFlyout: function(metadataModel, panel) {
        var me = this;
        //make some room for progress spinner
        panel.setContent('<br><br>');
        me._progressSpinner.insertTo(panel.html);
        me._progressSpinner.start();

        var licenseUrl = metadataModel.license;
        me.licenseService.doLicenseInformationSearch({
            id: licenseUrl
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                panel.setContent(me._getLicenseInfoContentForMetadataFlyout(response, metadataModel));
            } else {
                me._getLicenseInfoForMetadataFlyoutFailed(panel);
            }
        }, function () {
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license info failed', [].slice.call(arguments));
            me._getLicenseInfoForMetadataFlyoutFailed(panel);

        });
    },
    _getLicenseInfoForMetadataFlyoutFailed: function(panel) {
        var me = this;
        panel.setContent('<div><h2>'+me._locale.errors.cannotGetLicenseInformation.title+'</h2><p>'+me._locale.errors.cannotGetLicenseInformation.message+'</p></div>');
    },
    /**
     * Get price
     * @method _getPrice
     * @private
     */
    _getPrice: function() {
        var me = this,
            data = me._getLicenseInputValues();

        if(data.missingValues.length === 0) {
            me._progressSpinner.start();

            me.licenseService.doGetPrice({
                data: data.values,
                id: jQuery('.license_basic_data').attr('data-id'),
                modelid: jQuery('.license_basic_data').attr('data-model-id')
            }, function (response) {
                me._progressSpinner.stop();
                if (response) {
                    me._showLicenseOrderSummaryDialog(response);
                } else {
                    me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
                }
            }, function (response) {
                var errorMsg = null;
                me._progressSpinner.stop();
                me.getSandbox().printWarn('ELF license price failed', [].slice.call(arguments));
                if (response && response.responseText){
                    errorMsg = JSON.parse(response.responseText);
                }
                if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                    me._showMessage(me._locale.errors.cannotGetLicensePrice.title, errorMsg.error);
                } else {
                    me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
                }
            });
        } else {
            me._showMissingValuesMessage(data);
        }
    },
    /**
    * Shows missing values message.
    * @method
    * @private
    *
    * @param {Object} data missing values data
    */
    _showMissingValuesMessage: function(data){
        var me = this,
            message = me._locale.errors.checkFields.message + ':<div><ul class="elf_license_missing_valuelist">';
        jQuery.each(data.missingValues, function(index, value){
            message += '<li>' + value.title + '</li>';
        });
        message += '</ul></div>';
        me._showMessage(me._locale.errors.checkFields.title, message,0, true,true);
    },
    /**
     * Conclude license
     * @method _concludeLicense
     * @private
     */
    _concludeLicense: function() {
        var me = this,
            data = me._getLicenseInputValues(),
            userInfo = jQuery('<div></div>');

        if(data.missingValues.length === 0) {
            me._progressSpinner.start();

            me.licenseService.doConludeLicense({
                data: data.values,
                id: jQuery('.license_basic_data').attr('data-id'),
                modelid: jQuery('.license_basic_data').attr('data-model-id')
            }, function (response) {
                me._progressSpinner.stop();
                if (response) {
                    userInfo.css({ 'margin-top': '6px', 'margin-bottom': '6px'});
                    userInfo.html(me._locale.dialog.licenceConcluded.message);
                    me._showLicenseDeactivateDialog(response, me._metadata, userInfo);
                } else {
                    me._showMessage(me._locale.errors.concludeNoResponse.title, me._locale.errors.concludeNoResponse.message);
                }
            }, function (response) {
                var errorMsg = null;
                me._progressSpinner.stop();
                me.getSandbox().printWarn('ELF license conclude failed', [].slice.call(arguments));
                if (response && response.responseText){
                    errorMsg = JSON.parse(response.responseText);
                }
                if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                    me._showMessage(me._locale.errors.failedConclude.title, errorMsg.error);
                } else {
                   me._showMessage(me._locale.errors.failedConclude.title, me._locale.errors.failedConclude.message);
                }
            });
        } else {
            me._showMissingValuesMessage(data);
        }
    },
    /**
     * Show message
     * @method _showMessage
     * @private
     *
     * @param {String} title message title
     * @param {String} message the message
     * @param {Integer} time the message fadeout time. Default 5000.
     * @param {Boolean} fadeout do fadeout
     * @param {Function} handler button handler
     */
    _showMessage: function(title, message, time, fadeout, showOk, handler) {
        var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(me._locale.buttons.ok),
            fadeoutTime = 5000,
            doFadeout = true,
            doButton = false;

        if(me._showsMessage) {
            return;
        }

        if(time && time !== null && !isNaN(time)) {
            fadeoutTime = time;
        }

        if(fadeout || fadeout !== null) {
            doFadeout = fadeout;
        }

        if(showOk && showOk !== null) {
            doButton = showOk;
        }

        if(handler && handler !== null && typeof handler === 'function') {
            btn.setHandler(function(){
                dialog.close();
                handler();
            });
        } else {
             btn.setHandler(function(){
                dialog.close();
            });
        }

        me._showsMessage = true;

        if(!doButton) {
            dialog.show(title, message);
        } else {
            dialog.show(title, message, [btn]);
        }

        dialog.onClose(function() {
           me._showsMessage = false;
        });

        if(!doFadeout) {
            dialog.fadeout(fadeoutTime);
        }

    },
    /**
     * Show license deactivate information dialog
     * @method _showLicenseDeactivateDialog
     * @private
     *
     * @param {Object} data license information data
     * @param {Object} metadata the metadata
     * @param {Object} infoForUser jQuery element
     */
    _showLicenseDeactivateDialog: function(data, metadata, infoForUser){
        var me = this,
            dialogContent = me._templates.licenseDialog.clone(),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
            metadataTitle = '',
            cancelBtn = me._dialog.createCloseButton(this._locale.buttons.close),
            deactivateBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        me._showLicenseModels();
        me._metadata = metadata;

        cancelBtn.addClass('elf_license_close_button');

        deactivateBtn.addClass('elf_license_deactivate_button');
        deactivateBtn.setTitle(me._locale.buttons.deactivate);
        deactivateBtn.setHandler(function(){
            me._showDeactivateLicenseConfirm();
        });

        me._dialog.addClass('elf_license_dialog');
        title.removeClass('text');

        // If  founded models then shows them
        if(data.licenseModels.length > 0)  {
            title.html(me._locale.dialog.licenseModelsTitle);
        }
        // If not found then shows message
        else {
            title.addClass('text');
            // If user has already logged in  then shows at no right to anyone license
            if (Oskari.user().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            }
            // Else if user has not logged in then show log in message
            else {
                me._showLoginInfo(title);
            }
        }

        metadataTitle = metadata.name;

        me._dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [cancelBtn, deactivateBtn]);
        if(!infoForUser) {
            me._dialog.makeModal();
        }

        me._progressSpinner.insertTo(jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog'));

        // If there is orderer licensemodel then open it
        if(data.licenseModels.length === 1) {
            me._showLicenseDeactivateParams(data.licenseModels[0], data, infoForUser);
        }

    },
    _showLoginInfo: function(element){
        var me = this,
            html = jQuery('<div>')
        element.html('<div>' +
            me._locale.dialog.loginShort +
            '</div>' +
            '<div style="margin-top:20px;"><a href="http://locationframework.eu/content/registration" target="_blank">'+me._locale.dialog.registerLinkText+'</a></div>');
    },
    /**
     * Show license deactivate params dialog
     * @method _showLicenseDeactivateParams
     * @private
     *
     * @param {Object} model license model
     * @param {Object} licenseData license data
     * @param {Object} infoForUSer jQuery element
     */
    _showLicenseDeactivateParams: function(model, licenseData, infoForUser) {
        var me = this,
            modelDetails = me._templates.licenceModelUnconcludeDetails.clone(),
            licenseDetails = jQuery('.elf_license_dialog_license_details'),
            basicData = modelDetails.find('.license_basic_data'),
            closeButtonEl = jQuery('.elf_license_close_button'),
            deactivateButtonEl = jQuery('.elf_license_deactivate_button'),
            closeButtonMargin = closeButtonEl.outerWidth() - closeButtonEl.width(),
            validToElem = modelDetails.find('.validto_summary'),
            userInfo = modelDetails.find('.elf_license_user_info');

        me._showLicenseDetails();
        licenseDetails.empty();

        licenseDetails.addClass('large');

        modelDetails.find('.elf_name').html(model.name);

        if(infoForUser && infoForUser !== '') {
            userInfo.show();
            userInfo.append(infoForUser);
        } else {
            userInfo.hide();
        }


        modelDetails.find('.license_basic_data').append('<div></div>');
        modelDetails.find('.help').html(me._locale.dialog.help.orderDetails);

        basicData.attr('data-model-id', model.id);
        basicData.attr('data-id', licenseData.licenseId);

        if(model.params.length>0) {
            var userDataTable = modelDetails.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param, true);
                if(jQueryElement !== null) {
                    userDataTable.append(jQueryElement);
                }
            });
        }

        // Show license id
        if(licenseData.licenseId){
            var licenceIdElem = modelDetails.find('.license_id'),
                licenceIdText = me._locale.dialog.licenseId;
            licenceIdText = licenceIdText.replace('{licenseid}',licenseData.licenseId);
            licenceIdElem.html(licenceIdText);
        }

        // Show service URL
        if(licenseData.secureServiceURL){
            var licenceServiceURLElem = modelDetails.find('.service_url'),
                licenceServiceURLText = me._locale.dialog.licenseServiceUrl;
            licenceServiceURLText = licenceServiceURLText.replace('{serviceurl}', '<a href="' + licenseData.secureServiceURL + '" target="_blank">' + licenseData.secureServiceURL + '</a>');
            licenceServiceURLElem.html(licenceServiceURLText);
        }

        // Show valid to
        if(licenseData.validTo){
            var validText = me._locale.dialog.validTo;
            validText = validText.replace('{day}',licenseData.validTo);
            validToElem.html(validText);
        }

        licenseDetails.append(modelDetails);

        closeButtonEl.css('margin-left',  deactivateButtonEl.outerWidth() + closeButtonMargin);
    },
    /**
     * Shows deactivate confirm dialog.
     * @method _showDeactivateLicenseConfirm
     * @private
     */
    _showDeactivateLicenseConfirm: function(){
        var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            noBtn = dialog.createCloseButton(me._locale.buttons.no),
            yesBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        yesBtn.setTitle(me._locale.buttons.yes);
        yesBtn.setHandler(function(){
            dialog.close();
            me._deactivateLicense();
        });

        dialog.show(me._locale.dialog.deactivateConfirm.title, me._locale.dialog.deactivateConfirm.message , [noBtn, yesBtn]);
        dialog.makeModal();
    },
    /**
     * Deactivate license.
     * @method _deactivateLicense
     * @private
     */
    _deactivateLicense: function(){
        var me = this,
            data = me._getLicenseInputValues().values;

        me._progressSpinner.start();

        me.licenseService.doDeactivateLicense({
            data: data,
            id: jQuery('.license_basic_data').attr('data-id'),
            modelid: jQuery('.license_basic_data').attr('data-model-id')
        }, function (response) {
            me._progressSpinner.stop();

            if (response) {
                if(response.success) {
                    me._dialog.close();
                    me._showMessage(me._locale.success.deactivateLicense.title, me._locale.success.deactivateLicense.message);
                } else {
                    me._showMessage(me._locale.errors.cannotDeactivateLicense.title, me._locale.errors.cannotDeactivateLicense.message);
                }
            } else {
                me._showMessage(me._locale.errors.cannotDeactivateLicense.title, me._locale.errors.cannotDeactivateLicense.message);
            }
        }, function (response) {
            var errorMsg = null;
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license deactivate failed', [].slice.call(arguments));
            if (response && response.responseText){
                errorMsg = JSON.parse(response.responseText);
            }
            if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                me._showMessage(me._locale.errors.cannotDeactivateLicense.title, errorMsg.error);
            } else {
               me._showMessage(me._locale.errors.cannotDeactivateLicense.title, me._locale.errors.cannotDeactivateLicense.message);
            }
        });
    },
    /**
     * Show license subscription information dialog
     * @method _showLicenseSubscriptionInformationDialog
     * @private
     *
     * @param {Object} data license information data
     * @param {Object} metadata the metadata
     */
    _showLicenseSubscriptionInformationDialog: function(data, metadata){
        var me = this,
            dialogContent = me._templates.licenseDialog.clone(),
            models = dialogContent.find('.elf_license_dialog_licensemodels'),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
//            licenseDescriptions = dialogContent.find('.elf_license_dialog_descriptions'),
//            licenseDescriptionsTitle = dialogContent.find('.elf_license_dialog_descriptions_title'),
            metadataTitle = '',
            cancelBtn = me._dialog.createCloseButton(this._locale.buttons.close);

        me._showLicenseModels();
        me._metadata = metadata;

        me.prevBtn.addClass('elf_license_previous_button');
        me.prevBtn.setTitle(me._locale.buttons.previous);
        me.prevBtn.setHandler(function(){
            me._goBack();
        });

        me.nextBtn.addClass('elf_license_next_button');
        me.nextBtn.setTitle(me._locale.buttons.next);
        me.nextBtn.setHandler(function(){
            me._goNext();
        });

        me._dialog.addClass('elf_license_dialog');
        title.removeClass('text');

        // If  founded models then shows them
        if(data.licenseModels.length > 0)  {
            title.html(me._locale.dialog.licenseModelsTitle);
            dialogContent.find('.help').html(me._locale.dialog.help.info);
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
            if (Oskari.user().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            }
            // Else if user has not logged in then show log in message
            else {
                 me._showLoginInfo(title);
            }
        }


        metadataTitle = metadata.name;
        me._dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [me.prevBtn, cancelBtn, me.nextBtn]);
        me._dialog.makeModal();

        me._fixModelsHeight(dialogContent, models);

        me._progressSpinner.insertTo(jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog'));

        // If there is only one licensemodel then open it
        if(data.licenseModels.length === 1) {
            me._showLicenseParams(data.licenseModels[0], data);
        }
    },
    _getLicenseInfoContentForMetadataFlyout: function(data, metadataModel) {
        var me = this,
            dialogContent = me._templates.metadataFlyoutLicenseDialog.clone(),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
            licenseDescriptions = dialogContent.find('.elf_license_dialog_descriptions'),
            licenseDescriptionsTitle = dialogContent.find('.elf_license_dialog_descriptions_title');
        // If found models, show them
        if(data.licenseModels.length > 0)  {
            var description = jQuery('<li class="description"></li>');
            var localeDescription = me._locale.dialog.licenseModelDescriptions;
            for(var i in localeDescription) {
                if(localeDescription.hasOwnProperty(i)) {
                    var d = description.clone();
                    var text = me._locale.dialog.licenseModelDescriptions[i];
                    d.html(text);
                    licenseDescriptions.append(d);
                }
            }
            if(licenseDescriptions.find('.description').length>0) {
                licenseDescriptionsTitle.html(me._locale.dialog.licenseModelDescriptionsTitle);
            } else {
                licenseDescriptions.remove();
            }
        }
        // If not found then shows message
        else {
            title.addClass('text');
            licenseDescriptions.remove();
            licenseDescriptionsTitle.remove();
            // If user has already logged in  then shows at no right to anyone license
            if (Oskari.user().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            }
            // Else if user has not logged in then show log in message
            else {
                 me._showLoginInfo(title);
            }
        }
        var licenseDialogLink = jQuery("<a>"+me._locale.getLicenseText+"</a>");
        licenseDialogLink.attr('href','JavaScript:void(0);');
        var closureMagic = function(metadataModel) {
            if (data) {
                //fake a similar kind of json that is produced by the search channel -> the dialog only uses name and organization from here...
                var metadata = {
                    "name": metadataModel.identification.citation.title,
                    "organization": metadataModel.metadataResponsibleParties[0].organisationName
                };
                if(data.userLicense){
                    me._showLicenseDeactivateDialog(data, metadata);
                } else {
                    me._showLicenseSubscriptionInformationDialog(data, metadata);
                }
            } else {
                me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            }
        };

        licenseDialogLink.on('click' , function() {
            closureMagic(metadataModel);
        });
        dialogContent.append(licenseDialogLink);

        return dialogContent;
    },


    /**
     * @method  @private _fixModelsHeight fix models height
     * @param  {Object} dialogContent jQuery object for dialogContent div
     * @param  {Object} models jQuery object for models div
     */
    _fixModelsHeight: function(dialogContent, models){
        if(!models || !dialogContent) {
            return;
        }
        // Calculate models max height
        var calculatedMaxHeight = dialogContent.find('.elf_license_dialog_license_data').height();
        var c0 = dialogContent.find('.elf_license_dialog_description');
        var c1 = dialogContent.find('.elf_license_dialog_descriptions_title');
        var c2 = dialogContent.find('.elf_license_dialog_descriptions');
        var c3 = dialogContent.find('.elf_license_dialog_licensemodels_title');
        var c4 = dialogContent.find('.help');
        calculatedMaxHeight = calculatedMaxHeight - c0.height() - parseInt(c0.css('margin-top'), 10);
        calculatedMaxHeight = calculatedMaxHeight - c1.height() - parseInt(c1.css('margin-top'), 10);
        calculatedMaxHeight = calculatedMaxHeight - c2.height() - parseInt(c2.css('margin-top'), 10);
        calculatedMaxHeight = calculatedMaxHeight - c3.height() - parseInt(c3.css('margin-top'), 10);
        calculatedMaxHeight = calculatedMaxHeight - c4.height() - parseInt(c4.css('margin-top'), 10);

        models.css('max-height', calculatedMaxHeight + 'px')
    },
    /**
     * Go back
     * @method _goBack
     * @private
     */
    _goBack: function(){
        var me = this;
        me.nextBtn.setTitle(me._locale.buttons.next);
        if(me._dialogStep === null) {
            return;
        } else if(me._dialogStep === 'step2') {
            me._showLicenseModels();
        } else if(me._dialogStep === 'step3') {
            me._showLicenseDetails();
        }
    },
    /**
     * Go next
     * @method _goNext
     * @private
     */
    _goNext: function(){
        var me = this;
        if(me._dialogStep === null) {
            return;
        } else if(me._dialogStep === 'step2') {
            me._getPrice();
        } else if(me._dialogStep === 'step3') {
            me._concludeLicense();
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
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_details').hide();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_data').show();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_price').hide();
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
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_details').show();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_data').hide();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_price').hide();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_details').removeClass('large');
        me._checkButtonsVisibility();
    },
    /**
     * Shows license price summary.
     * @method _showLicensePriceSummary
     * @private
     */
    _showLicensePriceSummary: function(){
        var me = this;
        me._dialogStep = 'step3';
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_price').show();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_details').hide();
        jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_data').hide();
        me._checkButtonsVisibility();
    },
    /**
     * Show license order summary dialog
     * @method _showLicenseOrderSummaryDialog
     * @private
     *
     * @param {Object} model license model
     */
    _showLicenseOrderSummaryDialog: function(model){
        var me = this,
            licenseSummary = me._templates.licenceModelSummaryDetails.clone(),
            licensePrice = jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_price'),
            basicData = licenseSummary.find('.license_basic_data');

        me.nextBtn.setTitle(me._locale.buttons.conclude);

        me._showLicensePriceSummary();
        licensePrice.empty();

        licenseSummary.find('.name').html(model.name);
        licenseSummary.find('.header').html(me._locale.dialog.licenseSummaryTitle);
        licenseSummary.find('.price_summary .title').html(me._locale.dialog.priceTitle);
        licenseSummary.find('.help').html(me._locale.dialog.help.summary);
        licenseSummary.find('.price_summary .price').html(model.price + ' ' + me._locale.dialog.priceUnitEuro);

        basicData.attr('data-model-id', model.groupid);
        basicData.attr('data-id', model.id);

        if(model.params.length>0) {
            var userDataTable = licenseSummary.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param, true);
                if(jQueryElement !== null) {
                    userDataTable.append(jQueryElement);
                }
            });
        }

        licensePrice.append(licenseSummary);
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
            licenseDetails = jQuery('.divmanazerpopup.elf_license_dialog').find('.elf_license_dialog_license_details'),
            basicData = modelDetails.find('.license_basic_data');
        me._showLicenseDetails();
        licenseDetails.empty();

        modelDetails.find('.elf_name').html(model.name);
        modelDetails.find('.help').html(me._locale.dialog.help.details);

        basicData.attr('data-model-id', model.id);
        basicData.attr('data-id', licenseData.id);

        if(model.params.length>0) {
            var userDataTable = modelDetails.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param);
                if(jQueryElement !== null) {
                    userDataTable.append(jQueryElement);
                }
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
        var values = {
            values: [],
            missingValues: []
        };

        jQuery('.elf_license_user_data div.elf_license_input:visible').each(function(){
            var element = jQuery(this),
                type = element.attr('data-element-type'),
                readOnly = element.attr('data-read-only'),
                multi = element.attr('data-multi');

            var value = {
                name: element.attr('data-name'),
                values: []
            };

            var inputValues = null;

            if(!readOnly || readOnly === 'false') {
                if (type === 'int') {
                    inputValues = parseInt(element.find('input').val(), 10);
                } else if (type === 'text') {
                    inputValues = [];
                    var val = element.find('input').val();
                    if (val !== null && val !== '') {
                        inputValues.push(val);
                    }
                } else if (type === 'boolean') {
                    inputValues = element.find('input').is(':checked');
                } else if (type === 'enum') {
                    inputValues = [];
                    element.find('input:checked').each(function(){
                        inputValues.push(jQuery(this).val());
                    });
                } else {
                    return;
                }
            } else {
                if (type === 'int') {
                    inputValues = parseInt(element.find('div').attr('data-value'), 10);
                } else if (type === 'text') {
                    inputValues = [];
                    var val = element.find('div').attr('data-value');
                    if (val !== null && val !== '') {
                        inputValues.push(val);
                    }
                } else if (type === 'boolean') {
                    inputValues = element.find('div').attr('data-value') === 'true';
                } else if (type === 'enum') {
                    inputValues = [];
                    element.find('span').each(function(){
                        inputValues.push(jQuery(this).attr('data-value'));
                    });
                } else {
                    return;
                }
            }

            value.values = inputValues;

            // Check values
            // If type is enum and not multi then one value needed
            if (type === 'enum' && multi !== true && multi !== 'true' && inputValues.length !== 1) {
                value.title = element.attr('data-title');
                values.missingValues.push(value);
            }
            // Else if type is int
            else if (type === 'int' && (inputValues === null || isNaN(inputValues))) {
                value.title = element.attr('data-title');
                values.missingValues.push(value);
            }
            // Else if type is text
            else if (type === 'text' && (inputValues === null || inputValues.length === 0)) {
                value.title = element.attr('data-title');
                values.missingValues.push(value);
            } else {
                values.values.push(value);
            }
        });


        return values;
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});