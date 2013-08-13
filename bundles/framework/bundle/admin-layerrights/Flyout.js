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
            '       <table class="admin-layerrights-layers">' +
            '       </table>' +
            '       <div class="controls"></div>' +
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

    doSave : function() {
        // save data
        // get stuff from slickgrid, pass it as json to actionroute
        alert("Savety save.");
    },

    /**
     * @method setContent
     * Creates the UI for a fresh start
     */
    setContent : function(content) {
        // TODO add filters (provider/theme etc.)
        var me = this;
        var sandbox = me.instance.getSandbox();

        var flyout = jQuery(this.container);
        flyout.empty();
        var container = this.template.clone();
        
        var button = Oskari.clazz.create('Oskari.userinterface.component.Button');
        button.setTitle(this.instance.getLocalization('save'));

        button.setHandler(me.doSave);
        // Not sure if we want savew on enter
        //field.bindEnterKey(doSave);
        
        var controls = container.find('div.controls');
        controls.append(button.getButton());

        var roleSelectLabel = container.find('label > span');
        roleSelectLabel.html(this.instance.getLocalization('selectRole'));
        container.append(content);
        flyout.append(container);
        var roleSelect = flyout.find('select.admin-layerrights-role');
        console.log(roleSelect);
        roleSelect.change(function(eventObject) {
            console.log("change");
            me.updatePermissionsTable(roleSelect.find("option:selected").val());
        });
        // We're only supporting ROLE ATM, USER support might be added later
        me.getExternalIdsAjaxRequest("ROLE", 0);

    },

    updatePermissionsTable : function(activeRole) {
        alert("Update permissions table with role: " + activeRole);
    },

    getExternalIdsAjaxRequest : function(externalType, selectedId) {
        var me = this;
        /*
        //ajaxRequestGoing = true;
        // TODO add error handling
        jQuery.getJSON(ajaxUrl, {
            cmd: "ajax.jsp",
            getExternalIds: externalType
        }, function (result) {
            me.makeExternalIdsSelect(result, externalType, selectedId);
        })*/
        var fakeResult = {
            "external": [{
                "id": 10113,
                "name": "Administrator"
            }, {
                "id": 10118,
                "name": "Community Administrator"
            }, {
                "id": 271954,
                "name": "Community Content Reviewer"
            }, {
                "id": 10119,
                "name": "Community Member"
            }, {
                "id": 10120,
                "name": "Community Owner"
            }, {
                "id": 10114,
                "name": "Guest"
            }, {
                "id": 129919,
                "name": "Karttajulkaisija_Demo"
            }, {
                "id": 141182,
                "name": "Karttajulkaisija_Espoo"
            }, {
                "id": 142380,
                "name": "Karttajulkaisija_GTK"
            }, {
                "id": 267632,
                "name": "Karttajulkaisija_Helsinki"
            }, {
                "id": 238361,
                "name": "Karttajulkaisija_MML"
            }, {
                "id": 143017,
                "name": "Karttajulkaisija_NBA"
            }, {
                "id": 176071,
                "name": "Karttajulkaisija_Oulu"
            }, {
                "id": 214735,
                "name": "Karttajulkaisija_SKV"
            }, {
                "id": 174213,
                "name": "Karttajulkaisija_SYKE"
            }, {
                "id": 170924,
                "name": "Karttajulkaisija_TEM"
            }, {
                "id": 143970,
                "name": "Karttajulkaisija_Tre"
            }, {
                "id": 167679,
                "name": "Karttajulkaisija_Vihti"
            }, {
                "id": 11048,
                "name": "Karttakäyttäjät"
            }, {
                "id": 10121,
                "name": "Organization Administrator"
            }, {
                "id": 271955,
                "name": "Organization Content Reviewer"
            }, {
                "id": 10122,
                "name": "Organization Member"
            }, {
                "id": 10123,
                "name": "Organization Owner"
            }, {
                "id": 10115,
                "name": "Owner"
            }, {
                "id": 271956,
                "name": "Portal Content Reviewer"
            }, {
                "id": 10116,
                "name": "Power User"
            }, {
                "id": 51772,
                "name": "Termitalkoolaiset"
            }, {
                "id": 173056,
                "name": "Tiedontuottaja"
            }, {
                "id": 10117,
                "name": "User"
            }, {
                "id": 291301,
                "name": "Viranomainen"
            }, {
                "id": 51546,
                "name": "Wiki-admin"
            }, {
                "id": 26374,
                "name": "Yhteisön vastuukäyttäjä"
            }]
        };
        me.makeExternalIdsSelect(fakeResult, externalType, selectedId);
    },

    // result, (c)0/user/role, (b)selected id
    makeExternalIdsSelect : function(result, externalType, selectedId) {
        var externalIdSelect = jQuery(this.container).find("select.admin-layerrights-role");
        externalIdSelect.html("");
        if (externalType != "0") {
            var a;
            if (selectedId != "0") {
                a = '<option value="0" >-- Valitse tunniste --</option>';
            } else {
                a = '<option value="0" selected="selected">-- Valitse tunniste --</option>';
            }
            for (var d = 0; d < result.external.length; d++) {
                if (result.external[d].id == selectedId) {
                    a += '<option selected="selected" value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                } else {
                    a += '<option value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                }
            }
            externalIdSelect.html(a);
        } else {
            externalIdSelect.html("");
        }
    }

}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
