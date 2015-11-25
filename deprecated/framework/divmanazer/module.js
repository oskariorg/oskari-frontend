// This file needs to be manually updated based upon
// Oskari/packages/framework/bundle/divmanazer/bundle.js
// Last updated on 3.10.2014

define([
    "oskari",
    "src/framework/divmanazer/extension/EnhancedExtension",
    "jquery",
    "src/framework/oskariui/module",
    "./instance",
    "bundles/framework/bundle/divmanazer/request/AddExtensionRequest",
    "bundles/framework/bundle/divmanazer/request/AddExtensionRequestHandler",
    "bundles/framework/bundle/divmanazer/request/RemoveExtensionRequest",
    "bundles/framework/bundle/divmanazer/request/RemoveExtensionRequestHandler",
    "bundles/framework/bundle/divmanazer/request/UpdateExtensionRequest",
    "bundles/framework/bundle/divmanazer/request/UpdateExtensionRequestHandler",
    "bundles/framework/bundle/divmanazer/request/ModalDialogRequest",
    "bundles/framework/bundle/divmanazer/request/ModalDialogRequestHandler",
    "bundles/framework/bundle/divmanazer/event/ExtensionUpdatedEvent",
    "bundles/framework/bundle/divmanazer/component/Component",
    "bundles/framework/bundle/divmanazer/component/Accordion",
    "bundles/framework/bundle/divmanazer/component/AccordionPanel",
    "bundles/framework/bundle/divmanazer/component/TabContainer",
    "bundles/framework/bundle/divmanazer/component/TabDropdownContainer",
    "bundles/framework/bundle/divmanazer/component/TabPanel",
    "bundles/framework/bundle/divmanazer/component/Badge",
    "bundles/framework/bundle/divmanazer/component/Alert",
    "./component/Popup",
    "bundles/framework/bundle/divmanazer/component/Overlay",
    "bundles/framework/bundle/divmanazer/component/Button",
    "bundles/framework/bundle/divmanazer/component/FilterDialog",
    "bundles/framework/bundle/divmanazer/component/Form",
    "bundles/framework/bundle/divmanazer/component/SearchForm",
    "bundles/framework/bundle/divmanazer/component/UIHelper",
    "bundles/framework/bundle/divmanazer/component/FormInput",
    "bundles/framework/bundle/divmanazer/component/Popover",
    "bundles/framework/bundle/divmanazer/component/Grid",
    "bundles/framework/bundle/divmanazer/component/GridModel",
    "bundles/framework/bundle/divmanazer/component/ProgressSpinner",
    "bundles/framework/bundle/divmanazer/component/Container",
    "bundles/framework/bundle/divmanazer/component/FormComponent",
    "bundles/framework/bundle/divmanazer/component/Select",
    "bundles/framework/bundle/divmanazer/component/LanguageSelect",
    "bundles/framework/bundle/divmanazer/component/MultiLevelSelect",
    "bundles/framework/bundle/divmanazer/component/RadioButtonGroup",
    "bundles/framework/bundle/divmanazer/component/CheckboxInput",
    "bundles/framework/bundle/divmanazer/component/TextInput",
    "bundles/framework/bundle/divmanazer/component/EmailInput",
    "bundles/framework/bundle/divmanazer/component/NumberInput",
    "bundles/framework/bundle/divmanazer/component/PasswordInput",
    "bundles/framework/bundle/divmanazer/component/SearchInput",
    "bundles/framework/bundle/divmanazer/component/UrlInput",
    "bundles/framework/bundle/divmanazer/component/TextAreaInput",
    "bundles/framework/bundle/divmanazer/component/VisualizationForm",
    "bundles/framework/bundle/divmanazer/component/buttons/AddButton",
    "bundles/framework/bundle/divmanazer/component/buttons/CancelButton",
    "bundles/framework/bundle/divmanazer/component/buttons/CloseButton",
    "bundles/framework/bundle/divmanazer/component/buttons/DeleteButton",
    "bundles/framework/bundle/divmanazer/component/buttons/EditButton",
    "bundles/framework/bundle/divmanazer/component/buttons/OkButton",
    "bundles/framework/bundle/divmanazer/component/buttons/SaveButton",
    "bundles/framework/bundle/divmanazer/component/buttons/SearchButton",
    "bundles/framework/bundle/divmanazer/component/visualization-form/AreaForm",
    "bundles/framework/bundle/divmanazer/component/visualization-form/LineForm",
    "bundles/framework/bundle/divmanazer/component/visualization-form/DotForm",
    "bundles/framework/bundle/divmanazer/extension/DefaultTile",
    "bundles/framework/bundle/divmanazer/extension/DefaultFlyout",
    "bundles/framework/bundle/divmanazer/extension/DefaultExtension",
    "bundles/framework/bundle/divmanazer/extension/DefaultView",
    "bundles/framework/bundle/divmanazer/extension/DefaultLayout",
    "src/framework/divmanazer/extension/EnhancedTile",
    "src/framework/divmanazer/extension/EnhancedFlyout",
    "src/framework/divmanazer/extension/EnhancedView",
    "css!resources/framework/bundle/divmanazer/css/divman.css",
    "css!resources/framework/bundle/divmanazer/css/accordion.css",
    "css!resources/framework/bundle/divmanazer/css/tab.css",
    "css!resources/framework/bundle/divmanazer/css/modal.css",
    "css!resources/framework/bundle/divmanazer/css/badge.css",
    "css!resources/framework/bundle/divmanazer/css/alert.css",
    "css!resources/framework/bundle/divmanazer/css/formcomponent.css",
    "css!resources/framework/bundle/divmanazer/css/forminput.css",
    "css!resources/framework/bundle/divmanazer/css/grid.css",
    "css!resources/framework/bundle/divmanazer/css/popup.css",
    "css!resources/framework/bundle/divmanazer/css/button.css",
    "css!resources/framework/bundle/divmanazer/css/overlay.css",
    "css!resources/framework/bundle/divmanazer/css/visualizationform.css",
    "css!resources/framework/bundle/divmanazer/css/popover.css",
    "libraries/jquery/plugins/jquery-placeholder/jquery.placeholder", // this might not work at all
    "bundles/framework/bundle/mapmodule-plugin/locale/en",
    "bundles/framework/bundle/mapmodule-plugin/locale/fi",
    "bundles/framework/bundle/mapmodule-plugin/locale/sv"
], function (Oskari, Extension, jQuery) {

    // Create divmanazer module namespace
    Oskari.ui = {};

    /* DIVManazer shortcuts */
    this._baseClassFor = {
        'extension': "Oskari.userinterface.extension.EnhancedExtension",
        'tile': "Oskari.userinterface.extension.EnhancedTile",
        'flyout': "Oskari.userinterface.extension.EnhancedFlyout",
        'view': "Oskari.userinterface.extension.EnhancedView"
    };

    /* Simplified Tile, Flyout, Extension and Bundle API for Oskari 2.0 */
    Oskari.ui.Tile = Oskari.cls('Oskari.Tile').extend(this._baseClassFor.tile);
    Oskari.ui.Flyout = Oskari.cls('Oskari.Flyout').extend(this._baseClassFor.flyout);
    Oskari.ui.Extension = Extension;
    Oskari.ui.View = Oskari.cls('Oskari.View').extend(this._baseClassFor.view);

    return Oskari.bundleCls("divmanazer").category({
        create: function () {
            return Oskari.clazz.create("Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance");
        },
        update: function (manager, bundle, bi, info) {

        }
    });
});
