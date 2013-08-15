/**
 * @class Oskari.framework.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
 *        instance reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this.template = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.framework.bundle.admin-layerrights.Flyout';
    },

    /**
     * @method setEl
     * @param {Object} el
     *      reference to the container in browser
     * @param {Number} width
     *      container size(?) - not used
     * @param {Number} height
     *      container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if (!jQuery(this.container).hasClass('admin-layerrights')) {
            jQuery(this.container).addClass('admin-layerrights');
        }
    },

    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery(
            '<div class="admin-layerrights">\n' +
            '   <form method="post" id="admin-layerrights-form">' +
            '       <label><span></span>' +
            '          <select class="admin-layerrights-role"></select>\n' +
            '       </label>' + /*
            '       <label for="admin-layerrights-theme">Theme</label>' +
            '       <select id="admin-layerrights-theme"></select>\n' +
            '       <label for="admin-layerrights-dataprovidere">Data provider</label>' +
            '       <select id="admin-layerrights-dataprovider"></select>\n' +*/
            '       <div class="admin-layerrights-layers">' +
            '       </div>' +
            '       <button class="admin-layerrights-submit" type="submit"></button>' +
            '   </form>' +
            '</div>\n');
    },

    /**
     * @method stopPlugin
     *
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {
    },

    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('title');
    },

    /**
     * @method getDescription
     * @return {String} localized text for the description of the
     * flyout
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
    },

    /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
    getOptions : function() {

    },

    /**
     * @method setState
     * @param {Object} state
     */
    setState : function(state) {
        this.state = state;
    },

    /**
     * @method getState
     * @return {Object} state
     */
    getState : function() {
        if(!this.state) {
            return {};
        }
        return this.state;
    },

    /**
     * @method setContent
     * Creates the UI for a fresh start
     */
    setContent : function(content) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var flyout = jQuery(this.container);
        flyout.empty();
        var container = this.template.clone();
        var saveButton = container.find('button.admin-layerrights-submit');
        saveButton.html(this.instance.getLocalization('save'));
        var roleSelectLabel = container.find('label > span');
        roleSelectLabel.html(this.instance.getLocalization('selectRole'));
        container.append(content);
        flyout.append(container);

         var columns = [
            {id: "name", "name": "Name"},
            {id: "isSelected", "name": "Right to Publish"},
            {id: "isViewSelected", "name": "Right to View"},
            {id: "isDownloadSelected", "name": "Right to Download"},
            {id: "isViewPublishedSelected", "name": "Right to PublishView"},
        ];

//        me.createLayerRightGrid(columns, me._testJSON(), container.find('.admin-layerrights-layers'));
    }, 

/*    createLayerRightGrid: function(columnHeaders, layerRightsJSON, container) {
        var table = '<table>';

        table += "<thead><tr>";
        for (var i = 0; i < columnHeaders.length; i++) {
            var header = columnHeaders[i];
            table += '<th>' + header.name + '</th>';
        };
        table += "</tr></thead>";

        table += "<tbody>";
        for (var tr = 0; tr < layerRightsJSON.length; tr++) {
            var layerRight = layerRightsJSON[tr];

            table += "<tr>";

            // lets loop through header
            for (var i = 0; i < columnHeaders.length; i++) {
                var header = columnHeaders[i];

                //select input value based on arrangement of header columns
                var value = layerRight[header.id];

                if(header.id === 'name') {
                    table += '<td><span class="layer-name">'+value+'</span></td>';                    
                } else if(value != null && value === 'true') {
                    table += '<td><input type="checkbox" checked="checked" /></td>';
                } else {
                    table += '<td><input type="checkbox" /></td>';                    
                }
            };

            table += "</tr>";
        };
        table += "</tbody>";

    },
*/



    _testJSON: function() {
        return [
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "Aeromagneettiset matalalentomittaukset",
              "isViewPublishedSelected": "",
              "resourceName": "0",
              "namespace": "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer"
            },
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "Ajoradan leveys",
              "isViewPublishedSelected": "",
              "resourceName": "katselupalvelu:Ajoradan leveys",
              "namespace": "http://kartta.liikennevirasto.fi/maaliikenne/wms"
            },
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "Avoimet metsÃ¤maat",
              "isViewPublishedSelected": "",
              "resourceName": "mtk_avoimet_metsamaat",
              "namespace": "http://a.karttatiili.fi/dataset/peruskarttarasteri/service/wms,http://b.karttatiili.fi/dataset/peruskarttarasteri/service/wms,http://c.karttatiili.fi/dataset/peruskarttarasteri/service/wms,http://d.karttatiili.fi/dataset/peruskarttarasteri/service/wms"
            },
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "BussipysÃ¤kit",
              "isViewPublishedSelected": "",
              "resourceName": "katselupalvelu:bussipysakit",
              "namespace": "http://kartta.liikennevirasto.fi/maaliikenne/wms"
            },
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "Corine Land Cover 2000, 25 ha",
              "isViewPublishedSelected": "",
              "resourceName": "CorineLandCover2000_25ha",
              "namespace": "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer"
            },
            {
              "isViewSelected": "checked=\"yes\"",
              "isDownloadSelected": "",
              "isSelected": "",
              "name": "Corine Land Cover 2000, 25 m",
              "isViewPublishedSelected": "",
              "resourceName": "CorineLandCover2000_25m",
              "namespace": "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer"
            }
        ];
    }



}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
