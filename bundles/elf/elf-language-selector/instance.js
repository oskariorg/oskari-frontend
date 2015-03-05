/**
 * @class  Oskari.elf.LanguageSelector
 */
Oskari.clazz.define("Oskari.elf.languageselector.BundleInstance", function() {

}, {
    templates : {
        "link": '<a></a>',
        "option": '<option></option>',
        "flyout": '<div class="langSelection">' +
                '<select></select>' +
                '<a class="btn"></a>' +
            '</div>'
    },

    startPlugin : function() {
        var sandbox = this.getSandbox();
        var elem = jQuery('#langSelector');

        jQuery("#langSelector").appendTo("#maptools");

        // get localization file "Languages" for language "all" - imported by this bundle
        // don't try this at home
        var languages = Oskari.getLocalization('Languages', 'all');

        var _supported = Oskari.getSupportedLanguages();

        // reduce list to supported languages
        this.languageList = _.reduce(languages, function(result, value, key) {
            if(_.contains(_supported, key)) {
                result.push({
                    lang : key,
                    label : value.toLowerCase()
                });
            }
            return result;
        }, []);
        this.languageList.sort(function(a,b) {
            return a.label > b.label;
        });

        var langName = languages[Oskari.getLang()];
        elem.append('<p>' + langName + '</p>');

        var changeLink = jQuery(this.templates.link).clone();
        var changeLinkText = this.getLocalization('title');
        var rn = 'userinterface.UpdateExtensionRequest';
        var self = this;

        changeLink
            .text(changeLinkText)
            .attr({
                'href': '#'
            })
            .click(function (e) {
                e.preventDefault();
                sandbox.postRequestByName(rn, [self, 'attach', rn]);
            });
        elem.append(changeLink);
    },

    stopPlugin : function() {

    },

    getFlyoutContent : function () {
        var container = jQuery(this.templates.flyout).clone(),
            langList = container.find('select'),
            langOption = jQuery(this.templates.option),
            link = container.find('a'),
            loc, opt, firstLang;

        _.each(this.languageList, function(item) {
            var opt = langOption.clone();
            opt.val(item.lang);
            opt.text(item.label);
            if(item.lang === Oskari.getLang()) {
                opt.attr('selected', 'selected');
            }
            langList.append(opt);
        });

        langList.on('change', function (e) {
            var langCode = e.target.value;

            link.attr('href', '?lang=' + langCode);
        });

        firstLang = langList.find('option:selected').val();
        link.attr('href', '?lang=' + firstLang)
            .text(this.getLocalization('change'));

        return container;
    },

    eventHandlers : {}
}, {
    "extend" : ["Oskari.elf.extension.EnhancedExtension"]
});
