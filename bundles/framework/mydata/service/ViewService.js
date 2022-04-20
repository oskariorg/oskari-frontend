/**
 * @class Oskari.mapframework.bundle.mydata.service.ViewService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mydata.service.ViewService',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.mapframework.bundle.mydata.service.ViewService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'ViewService',
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method loadViews
         * Makes the actual ajax call to view service implementation
         * @param {String}
         *            type view type [USER | PUBLISHED]
         * @param {Function}
         *            callback callback method called when operation completes. The
         * function will receive boolean value as parameter indicating success(true)
         * or error(false). IF success, second parameter has the response.
         */
        loadViews: function (type, callback) {
            if (!type) {
                type = 'USER';
            }

            jQuery.ajax({
                url: Oskari.urls.getRoute('GetViews'),
                data: {
                    viewType: type
                },
                type: 'POST',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    /* eslint-disable node/no-callback-literal */
                    callback(true, response);
                },
                error: function () {
                    /* eslint-disable node/no-callback-literal */
                    callback(false);
                }
            });
        },
        /**
         * @method deleteView
         * Makes the actual ajax call to view service implementation
         * @param {Object}
         *            view object presenting a view
         * @param {Function}
         *            callback callback method called when operation completes. The
         * function will receive boolean value as parameter indicating success(true)
         * or error(false)
         */
        deleteView: function (view, callback) {
            jQuery.ajax({
                url: Oskari.urls.getRoute('DeleteView'),
                data: {
                    id: view.id
                },
                type: 'POST',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    /* eslint-disable node/no-callback-literal */
                    callback(true);
                },
                error: function () {
                    /* eslint-disable node/no-callback-literal */
                    callback(false);
                }
            });
        },

        /**
         * @method makeViewPublic
         * Makes the actual ajax call to view service implementation
         * @param {Number}
         *            if view id
         * @param {Boolean}
         *            isPublic true to make view public, false to make view private
         * @param {Function}
         *            callback callback method called when operation completes. The
         * function will receive boolean value as parameter indicating success(true)
         * or error(false)
         */
        makeViewPublic: function (id, isPublic, callback) {
            jQuery.ajax({
                url: Oskari.urls.getRoute('AdjustViewAccess'),
                data: {
                    id: id,
                    isPublic: isPublic
                },
                type: 'POST',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    /* eslint-disable node/no-callback-literal */
                    callback(true);
                },
                error: function () {
                    /* eslint-disable node/no-callback-literal */
                    callback(false);
                }
            });
        },
        /**
         * @method updateView
         * Makes the actual ajax call to view service implementation
         * @param {Number}
         *            if view id
         * @param {String}
         *            name new name for the view
         * @param {String}
         *            description new description for the view
         * @param {Function}
         *            callback callback method called when operation completes. The
         * function will receive boolean value as parameter indicating success(true)
         * or error(false)
         */
        updateView: function (id, name, description, isDefault, callback) {
            jQuery.ajax({
                url: Oskari.urls.getRoute('UpdateView'),
                type: 'POST',
                data: {
                    id: id,
                    newName: name,
                    newDescription: description,
                    newIsDefault: isDefault
                },
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    /* eslint-disable node/no-callback-literal */
                    callback(true);
                },
                error: function () {
                    /* eslint-disable node/no-callback-literal */
                    callback(false);
                }
            });
        },
        /**
         * Checks if the layers in view data are available
         *
         * @method isViewLayersLoaded
         * @param {Object} viewData
         * @param {Object} sandbox reference to sandbox to get loaded layers
         * @return {Object} Returns object with boolean property status (true if everything ok, false if not)
         *    and String property msg with message key:
         *  - 'error' == generic error
         *  - 'missing' == layers loaded but referenced layer not found
         *  - 'notloaded' == layers ajax call hasnt completed yet
         */
        isViewLayersLoaded: function (viewData, sandbox) {
            var response = {
                status: false,
                msg: 'error'
            };
            // data.state.mapfull.state.selectedLayers[{id:<layerid>}]
            if (viewData &&
                viewData.state &&
                viewData.state.mapfull &&
                viewData.state.mapfull.state &&
                viewData.state.mapfull.state.selectedLayers) {
                var selected = viewData.state.mapfull.state.selectedLayers,
                    mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    loaded = mapLayerService.isAllLayersLoaded(),
                    layerMissing = !mapLayerService.hasLayers(selected.map(function (l) { return l.id; }));

                if (loaded) {
                    // layers loaded
                    if (layerMissing) {
                        // but some layers are missing
                        response.msg = 'missing';
                    } else {
                        // and all layers found
                        response.status = true;
                        response.msg = 'ok';
                    }
                } else if (layerMissing) {
                    // not loaded yet and layer missing
                    response.msg = 'notloaded';
                } else {
                    // not loaded yet but all layers found
                    response.status = true;
                    response.msg = 'ok';
                }
            }
            return response;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    });
