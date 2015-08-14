/**
 * @class  Oskari.elf.LanguageSelector
 */
Oskari.clazz.define("Oskari.elf.languageselector.BundleInstance", function() {

}, {
    templates : {
        "link": '<a></a>',
        "flyout": '<div class="langSelection">' +
                '<select></select>' +
                '<a class="btn">Choose</a>' +
            '</div>',
        "fi" : {
            "content" : '<a href="?lang=fi#">eesti</a><br /><a href="?lang=fi#">suomi</a><br /><br /><a href="?lang=sv#">ruotsi</a><br />' + '<a href="?lang=en#">englanti</a><br /><br /><a href="?lang=de#">saksa</a><br />' + '<a href="?lang=es#">espanja</a><br /><br /><a href="?lang=cs#">tsekki</a><br />'
        },
        "sv" : {
            "content" : '<a href="?lang=fi#">finska</a><br /><br /><a href="?lang=sv#">svenska</a><br />' + '<a href="?lang=en#">engelska</a><br /><br /><a href="?lang=de#">tyska</a><br />' + '<a href="?lang=es#">spanska</a><br /><br /><a href="?lang=cs#">tjeckiska</a><br />'
        },
        "de" : {
            "content" : '<a href="?lang=fi#">Finnisch</a><br /><br /><a href="?lang=sv#">Schwedisch</a><br />' + '<a href="?lang=en#">Englisch</a><br /><br /><a href="?lang=de#">Deutsch</a><br />' + '<a href="?lang=es#">Spanisch</a><br /><br /><a href="?lang=cs#">Tschechisch</a><br />'
        },
        "en" : {
            "content" : '<a href="?lang=et#">Estonian</a><br /><a href="?lang=hr#">Croatian</a><br /><a href="?lang=pl#">Polish</a><br /><a href="?lang=pt#">Portuguese</a><br /><a href="?lang=fi#">Finnish</a><br /><br /><a href="?lang=sv#">Swedish</a><br />' + '<a href="?lang=en#">English</a><br /><br /><a href="?lang=de#">German</a><br />' + '<a href="?lang=es#">Spanish</a><br /><br /><a href="?lang=cs#">Czech</a><br />'
        },
        "cs" : {
            "content" : '<a href="?lang=fi#">Finština</a><br /><br /><a href="?lang=sv#">Švédština</a><br />' + '<a href="?lang=en#">Angličtina</a><br /><br /><a href="?lang=de#">Němčina</a><br />' + '<a href="?lang=es#">Španělština</a><br /><br /><a href="?lang=cs#">Čeština</a><br />'
        },
        "es" : {
            "content" : '<a href="?lang=fi#">finés</a><br /><br /><a href="?lang=sv#">sueco</a><br />' + '<a href="?lang=en#">inglés</a><br /><br /><a href="?lang=de#">alemán</a><br />' + '<a href="?lang=es#">español</a><br /><br /><a href="?lang=cs#">checo</a><br />'
        }

    },

    locales : {
        "fi" : {
            "name": "Suomi",
            "title" : "Valitse kieli",
            "tile" : {
                "title" : "kieli"
            },
            "flyout": {
                "button": "Valitse"
            }
        },
        "sv" : {
            "name": "Svenska",
            "title" : "Välj språk",
            "tile" : {
                "title" : "språk"
            },
            "flyout": {
                "button": "Välj"
            }
        },
        "en" : {
            "name": "English",
            "title" : "Change language",
            "tile" : {
                "title" : "language"
            },
            "flyout": {
                "button": "Change"
            }
        }

    },

    startPlugin : function() {
        this.conf = {
            "name" : "elf-language-selector",
            "elemId": "langSelector"
        };

        var sandbox = this.getSandbox();

        var elem = jQuery('#' + this.conf.elemId);
        var langName = this._localization.name;
        elem.append('<p>' + langName + '</p>');

        var changeLink = jQuery(this.templates.link).clone();
        var changeLinkText = this._localization.title;
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
            languages = this.locales,
            langList = container.find('select'),
            langOption = jQuery('<option></option>'),
            link = container.find('a'),
            loc, opt, firstLang;

        for (loc in languages) {
            opt = langOption.clone();
            opt.val(loc);
            opt.text(languages[loc].name);
            langList.append(opt);
        }

        langList.on('change', function (e) {
            var langCode = e.target.value;

            link.attr('href', '?lang=' + langCode);
        });

        firstLang = langList.find('option:selected').val();
        link.attr('href', '?lang=' + firstLang)
            .text(this._localization.flyout.button);

        return container;
    },

    eventHandlers : {}
}, {
    "extend" : ["Oskari.elf.extension.EnhancedExtension"]
});
