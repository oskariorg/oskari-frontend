/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.lang.overrides.Bundle
 */
Oskari.clazz.define("Oskari.paikkis.language.Bundle", function() {

}, {
    "create" : function() {
        return this;
    },
    "start": function() {},
    "stop": function() {}
}, {
    "source" : {
        "scripts" : [],
        "locales" : [
            {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/lang-overrides/resources/locale/fi.js"
            },
            {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/lang-overrides/resources/locale/sv.js"
            },
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/lang-overrides/resources/locale/en.js"
            }
        ]
    }
});

Oskari.bundle_manager.installBundleClass("lang-overrides", "Oskari.paikkis.language.Bundle");
