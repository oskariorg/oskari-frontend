/**
 * @class Oskari.elf.license.service.LicenseService
 */
Oskari.clazz.define('Oskari.elf.license.service.LicenseService',
    function(instance, licenseServiceUrl) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this._licenseServiceUrl = licenseServiceUrl;
        this._pendingAjaxQuery = {
            licenseInformation: {
                busy: false,
                jqhr: null,
                timestamp: null
            },
            getPrice: {
                busy: false,
                jqhr: null,
                timestamp: null
            },
            concludeLicense: {
                busy: false,
                jqhr: null,
                timestamp: null
            },
            deactivateLicense: {
                busy: false,
                jqhr: null,
                timestamp: null
            }
        };
    }, {
        __name: 'elf-license.LicenseService',
        __qname: 'Oskari.elf.license.service.LicenseService',
        /**
         * Get Qualified name
         * @method getQName
         * @public
         */
        getQName: function () {
            return this.__qname;
        },
        /**
         * Get name
         * @method getName
         * @public
         */
        getName: function () {
            return this.__name;
        },
        /**
         * Initializes the service
         * @method init
         * @public
         */
        init: function () {},
        /**
         * Get url
         * @method getUrl
         * @private
         * @param {Object} options url options
         * 
         * @return {String} url
         */
        _getLicenseInformationData: function (options) {
            var me = this,
                data = {},
                lang = Oskari.getLang(),
                epsg = me.sandbox.getMap().getSrsName();

            data['lang'] = lang;
            data['epsg'] = epsg;
            for (var opt in options) {
                if (options.hasOwnProperty(opt)) {
                    data[opt] = options[opt];
                }
            }

            return data;
        },
        /**
         * Cancel ajax request
         * @method _cancelAjaxRequest
         * @private
         * 
         * @param {String} requestName request name
         */
        _cancelAjaxRequest: function (requestName) {
            var me = this;
            if (!me._pendingAjaxQuery[requestName] || !me._pendingAjaxQuery[requestName].busy) {
                return;
            }
            var jqhr = me._pendingAjaxQuery[requestName].jqhr;
            me._pendingAjaxQuery[requestName].jqhr = null;
            if (!jqhr) {
                return;
            }
            me.sandbox.printDebug("[elf-license.LicenseService] Abort jqhr ajax request");
            jqhr.abort();
            jqhr = null;
            me._pendingAjaxQuery[requestName].busy = false;
        },
        /**
         * @method _startAjaxRequest
         * @private
         * Start ajax request
         */
        _startAjaxRequest: function (dteMs, requestName) {
            var me = this;
            me._pendingAjaxQuery[requestName].busy = true;
            me._pendingAjaxQuery[requestName].timestamp = dteMs;

        },
        /**
         * @method _finishAjaxRequest
         * @private
         * Finish ajax request
         */
        _finishAjaxRequest: function (requestName) {
            var me = this;
            me._pendingAjaxQuery[requestName].busy = false;
            me._pendingAjaxQuery[requestName].jqhr = null;
            
            me.sandbox.printDebug("[elf-license.LicenseService] finished jqhr ajax request");
        },
        /**
         * Do license search
         * @method doLicenseInformationSearch
         * @public
         *
         * @param {Object} options url options
         * @param {Function} successCb success callback
         * @param {Function} errorCd error callback
         */
        doLicenseInformationSearch: function (options, successCb, errorCb) {
            var me = this,
                data = me._getLicenseInformationData(options),
                dte = new Date(),
                dteMs = dte.getTime();

            if (me._pendingAjaxQuery['licenseInformation'].busy && me._pendingAjaxQuery['licenseInformation'].timestamp &&
                dteMs - me._pendingAjaxQuery['licenseInformation'].timestamp < 500) {
                me.sandbox.printDebug("[elf-license.LicenseService] License information request NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest('licenseInformation');
            me._startAjaxRequest(dteMs, 'licenseInformation');

            jQuery.ajax({
                dataType : "json",
                type : "GET",
                data: data,
                beforeSend: function(x) {
                    me._pendingAjaxQuery['licenseInformation'].jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : me._licenseServiceUrl,
                error : function() {
                    me._finishAjaxRequest('licenseInformation');
                    errorCb();
                },
                success : function(data) {
                    me._finishAjaxRequest('licenseInformation');
                    successCb(data);
                },
                always: function () {
                    me._finishAjaxRequest('licenseInformation');
                },
                complete: function () {
                    me._finishAjaxRequest('licenseInformation');
                }
            });
        },
        /**
         * Do get price
         * @method doGetPrice
         * @public
         *
         * @param {Object} options url options
         * @param {Function} successCb success callback
         * @param {Function} errorCd error callback
         */
        doGetPrice: function (options, successCb, errorCb) {
            options.data = JSON.stringify(options.data);
            var me = this,
                data = me._getLicenseInformationData(options),
                dte = new Date(),
                dteMs = dte.getTime();

            if (me._pendingAjaxQuery['getPrice'].busy && me._pendingAjaxQuery['getPrice'].timestamp &&
                dteMs - me._pendingAjaxQuery['getPrice'].timestamp < 500) {
                me.sandbox.printDebug("[elf-license.LicenseService] License information request NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest('getPrice');
            me._startAjaxRequest(dteMs, 'getPrice');

            jQuery.ajax({
                dataType : "json",
                type : "POST",
                data: data,
                beforeSend: function(x) {
                    me._pendingAjaxQuery['getPrice'].jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : me._licenseServiceUrl,
                error : function(jqXHR,textStatus, errorThrown) {
                    me._finishAjaxRequest('getPrice');
                    errorCb(jqXHR);
                },
                success : function(data) {
                    me._finishAjaxRequest('getPrice');
                    successCb(data);
                },
                always: function () {
                    me._finishAjaxRequest('getPrice');
                },
                complete: function () {
                    me._finishAjaxRequest('getPrice');
                }
            });
        },
        /**
         * Do conclude license
         * @method doConludeLicense
         * @public
         *
         * @param {Object} options url options
         * @param {Function} successCb success callback
         * @param {Function} errorCd error callback
         */
        doConludeLicense: function (options, successCb, errorCb) {
            options.data = JSON.stringify(options.data);
            var me = this,
                data = me._getLicenseInformationData(options),
                dte = new Date(),
                dteMs = dte.getTime();

            if (me._pendingAjaxQuery['concludeLicense'].busy && me._pendingAjaxQuery['concludeLicense'].timestamp &&
                dteMs - me._pendingAjaxQuery['concludeLicense'].timestamp < 500) {
                me.sandbox.printDebug("[elf-license.LicenseService] License information request NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest('concludeLicense');
            me._startAjaxRequest(dteMs, 'concludeLicense');

            jQuery.ajax({
                dataType : "json",
                type : "PUT",
                data: data,
                beforeSend: function(x) {
                    me._pendingAjaxQuery['concludeLicense'].jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : me._licenseServiceUrl,
                error : function(jqXHR,textStatus, errorThrown) {
                    me._finishAjaxRequest('concludeLicense');
                    errorCb(jqXHR);
                },
                success : function(data) {
                    me._finishAjaxRequest('concludeLicense');
                    successCb(data);
                },
                always: function () {
                    me._finishAjaxRequest('concludeLicense');
                },
                complete: function () {
                    me._finishAjaxRequest('concludeLicense');
                }
            });
        },
        /**
         * Do deactivate license
         * @method doDeactivateLicense
         * @public
         *
         * @param {Object} options url options
         * @param {Function} successCb success callback
         * @param {Function} errorCd error callback
         */
        doDeactivateLicense: function (options, successCb, errorCb) {
            options.data = JSON.stringify(options.data);
            var me = this,
                data = me._getLicenseInformationData(options),
                dte = new Date(),
                dteMs = dte.getTime();

            if (me._pendingAjaxQuery['deactivateLicense'].busy && me._pendingAjaxQuery['deactivateLicense'].timestamp &&
                dteMs - me._pendingAjaxQuery['deactivateLicense'].timestamp < 500) {
                me.sandbox.printDebug("[elf-license.LicenseService] License information request NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest('deactivateLicense');
            me._startAjaxRequest(dteMs, 'deactivateLicense');

            console.dir(data);

            jQuery.ajax({
                dataType : "json",
                type : "DELETE",
                beforeSend: function(x) {
                    me._pendingAjaxQuery['deactivateLicense'].jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : me._licenseServiceUrl + '&' + jQuery.param(data),
                error : function(jqXHR,textStatus, errorThrown) {
                    me._finishAjaxRequest('deactivateLicense');
                    errorCb(jqXHR);
                },
                success : function(data) {
                    me._finishAjaxRequest('deactivateLicense');
                    successCb(data);
                },
                always: function () {
                    me._finishAjaxRequest('deactivateLicense');
                },
                complete: function () {
                    me._finishAjaxRequest('deactivateLicense');
                }
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
