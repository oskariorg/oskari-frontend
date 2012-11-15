/**
 * @class Oskari.mapframework.bundle.featuredata.service.GridModelManager
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.service.GridModelManager',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method getData
     * @param {Object} data JSON data for WFS grid
     * @return {Object/Boolean} parsed data or false if not successful
     * Parses the JSON data to an object with keys as localized featuredata
     * labels and values as Oskari.userinterface.component.GridModel.
     * Also adds an "all" named model to the returned object featuring 
     * all the data from all the featuredatas with an additional field 
     * "__featureName" which has the featuredata name where the data is originally.
     */
    getData : function(data) {
        if(!this._isValidData(data)) {
            return false;
        }
        var models = this._getModels(data);

        // calculate "all" data model
        if(data.featureDatas.length < 2) {
            // we can shortcut and just copy to only featuredata to allModel
            for(var feature in models) {
                // should loop only once and set this
                models['all'] = models[feature];
            }
        } else {
            var featureNameField = '__featureName';
            // populate from all featuredatas
            var allModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            allModel._addField(featureNameField);
            for(var feature in models) {
                var model = models[feature];
                var fields = model.getFields();
                for(var i = 0; i < fields.length; i++) {
                    var attr = fields[i];
                    var foundAtIndex = this._findInList(allModel.getFields(), attr);
                    if(foundAtIndex === -1) {
                        allModel._addField(attr);
                    } else {
                        // column with same name cannot be defined twice
                        // -> just drop if already existing
                        // TODO: check if we need to keep the column (maybe prefix
                        // with panel title)
                        // attr = parsedData.title + ' - ' + attr;
                    }
                }
                var data = model.getData();
                for(var i = 0; i < data.length; i++) {
                    var allData = data[i];
                    allData[featureNameField] = feature;
                    allModel.addData(allData);
                }
            }
            models['all'] = allModel;
        }
        return models;
    },
    /**
     * @method _isValidData
     * @param {Object} data JSON data for WFS grid
     * @private
     * @return {Boolean} true if data is good to go 
     * Validates the data so we can process it safely if this returns true.
     */
    _isValidData : function(data) {
        if(!data || !data.headers || !data.featureDatas) {
            return false;
        }

        // Check at datas have content
        for(var i = 0; i < data.featureDatas.length; i++) {
            if(data.featureDatas[i].children == null) {
                return false;
            }
        }
        return true;
    },
    /**
     * @method _findInList
     * @param {String[]} pList list to check
     * @param {String} pValue value to find in list
     * @private
     * @return {Number} index of the value in given list or -1 if not found 
     * Checks if the list contains the given value. Returns the values 
     * location/index in the list or -1 if not found.
     */
    _findInList : function(pList, pValue) {
        for(var i = 0; i < pList.length; ++i) {
            if(pList[i] == pValue) {
                return i;
            }
        }
        return -1;
    },
    /**
     * @method _getModels
     * @param {Object} data JSON data for WFS grid
     * @private
     * @return {Object} parsed data
     * Parses the JSON data to an object with keys as localized featuredata
     * labels and values as Oskari.userinterface.component.GridModel.
     */
    _getModels : function(data) {
        var lang = Oskari.getLang();
        var value = {};
        for(var i = 0; i < data.featureDatas.length; i++) {
            var featureData = data.featureDatas[i];
            var model = this._getIndividualModel(featureData);
            var featureName = featureData["feature_" + lang]
            value[featureName] = model;
        }
        return value;
    },
    /**
     * @method _getIndividualModel
     * @param {Object} featureData individual featuredata JSON for WFS grid
     * @private
     * @return {Object} parsed data
     * Parses the JSON data to Oskari.userinterface.component.GridModel.
     */
    _getIndividualModel : function(featureData) {
        var model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        for(var i = 0; i < featureData.children.length; i++) {
            model.addData(featureData.children[i]);
        }
        return model;
    }
});
