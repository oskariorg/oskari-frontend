/**
 * Creates on, off, trigger functions for Oskari
 */
(function (o) {
    if (!o) {
        // can't add eventbus if no Oskari ref
        return;
    }
    if (o.requestBuilder) {
        // already created on, don't run again
        return;
    }
    var log = Oskari.log('Messages');
    var clazzes = {};

    function getClazzByNameAndType (name, type) {
        var typeNames = clazzes[type];
        if (!typeNames) {
            clazzes[type] = {};
            typeNames = clazzes[type];
        }
        if (typeNames[name]) {
            return typeNames[name];
        }
        log.debug('Updating metadata for ' + type);
        var allKnownClassesOfType = Oskari.clazz.protocol(type);
        for (var clazzName in allKnownClassesOfType) {
            if (!allKnownClassesOfType.hasOwnProperty(clazzName)) {
                continue;
            }
            var clazzDefinition = allKnownClassesOfType[clazzName];
            var requestName = clazzDefinition._class.prototype.getName();
            typeNames[requestName] = clazzName;
        }
        log.debug('Finished updating metadata for ' + type);
        return typeNames[name];
    }

    o.requestBuilder = function (name) {
        var qname = getClazzByNameAndType(name, 'Oskari.mapframework.request.Request');
        if (!qname) {
            log.warn('No builder found for', name);
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    };

    o.eventBuilder = function (name) {
        var qname = getClazzByNameAndType(name, 'Oskari.mapframework.event.Event');
        if (!qname) {
            log.warn('No builder found for', name);
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    };
}(Oskari));
