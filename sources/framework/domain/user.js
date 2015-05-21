/**
 * @class Oskari.mapframework.domain.User
 *
 * Contains information about a logged in user.
 * If #isLoggedIn returns true, other methods should return info about user.
 * Otherwise the user isn't logged in and no data is available.
 */
Oskari.clazz.define('Oskari.mapframework.domain.User',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Initial data on construction with
     * Oskari.clazz.create('Oskari.mapframework.domain.User', (here))
     *
     * @param {Object} userData
     *            json data about the user. If undefined -> user not logged in.
     *            Should have atleast name and uuid for a logged in user.
     */

    function (userData) {

        this._loggedIn = false;
        this._roles = [];
        if (userData) {
            this._firstName = userData.firstName;
            this._lastName = userData.lastName;
            this._nickName = userData.nickName;
            // TODO: remove loginName as it's misleading and use email instead
            this._email = userData.email || userData.loginName;
            this._uuid = userData.userUUID;
            this._roles = userData.roles || [];
            if (userData.userUUID) {
                this._loggedIn = true;
            }
            this._apiKey = userData.apikey;
        }
    }, {
        /**
         * @method getName
         * Full name for the user
         *
         * @return {String}
         *            name
         */
        getName: function () {
            return this._firstName + " " + this._lastName;
        },
        /**
         * @method getFirstName
         * First name for the user
         *
         * @return {String}
         *            first name
         */
        getFirstName: function () {
            return this._firstName;
        },
        /**
         * @method getLastName
         * Last name for the user
         *
         * @return {String}
         *            last name
         */
        getLastName: function () {
            return this._lastName;
        },
        /**
         * @method getNickName
         * Nickname for the user
         *
         * @return {String}
         *            nickname
         */
        getNickName: function () {
            return this._nickName;
        },
        /**
         * @deprecated Use getEmail() instead!
         * @method getLoginName
         * Loginname for the user
         *
         * @return {String}
         *            loginName
         */
        getLoginName: function () {
            return this.getEmail();
        },
        /**
         * @method getLoginName
         * Loginname for the user
         *
         * @return {String}
         *            loginName
         */
        getEmail: function () {
            return this._email;
        },
        /**
         * @method getUuid
         * Uuid for the user
         *
         * @return {String}
         *            uuid
         */
        getUuid: function () {
            return this._uuid;
        },
        /**
         * @method getAPIkey
         * API-key for the user
         *
         * @return {String}
         */
        getAPIkey: function () {
            return this._apiKey;
        },
        /**
         * @method isLoggedIn
         * Returns true if user is logged in
         *
         * @return {Boolean}
         */
        isLoggedIn: function () {
            return this._loggedIn;
        },
        /**
         * @method getRoles
         * Roles for the user
         *
         * @return {Object}
         *            roles
         */
        getRoles: function () {
            return this._roles;
        },

        /**
         * Returns true if user has any role matching any id provided as param
         * @method hasRole
         * 
         * @param {Number[]} list of ids
         * @return {Boolean} true if any id match roles that user has
         */
        hasRole: function (ids) {
            if (ids && ids.length) {
                var i, ilen, j, jlen, role, roles = this.getRoles();
                ilen = ids.length;
                jlen = roles.length;
                for (i = 0; i < ilen; i++) {
                    id = ids[i];
                    for (j = 0; j < jlen; j++) {
                        role = roles[j];
                        if (id === role.id) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    });