Oskari.registerLocalization({
    lang: 'fi',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Lisää',
            cancel: 'Peruuta',
            close: 'Sulje',
            delete: 'Poista',
            edit: 'Muokkaa',
            save: 'Tallenna',
            submit: 'Lähetä',
            import: 'Tuo',
            yes: 'Kyllä',
            no: 'Ei'
        },
        error: {
            generic: 'Tapahtui odottamaton virhe'
        },
        table: {
            sort: {
                desc: 'Lajittele laskevasti',
                asc: 'Lajittele nousevasti',
                cancel: 'Peruuta lajittelu'
            },
            emptyText: 'Ei tuloksia.'
        },
        ColorPicker: {
            tooltip: 'Valitse väri',
            moreColors: 'Enemmän värejä'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometriatyyppi',
                name: 'Tyylin nimi',
                style: 'Esitystapa',
                pointTab: 'Piste',
                lineTab: 'Viiva',
                areaTab: 'Alue'
            },
            tooltips: {
                transparent: 'Ei täyttöväriä',
                solid: 'Peittävä täyttöväri',
                thin_diagonal: 'Ohut vinottainen raita',
                thick_diagonal:'Paksu vinottainen raita',
                thin_horizontal: 'Ohut vaakaraita',
                thick_horizontal: 'Paksu vaakaraita'
            },
            fill: {
                color: 'Täyttöväri',
                area: {
                    pattern: 'Täyttökuvio'
                }
            },
            image: {
                shape: 'Symboli',
                size: 'Koko',
                fill: {
                    color: 'Väri'
                }
            },
            stroke: {
                color: 'Väri',
                lineCap: 'Päädyt',
                lineDash: 'Tyyli',
                lineJoin: 'Kulmat',
                width: 'Leveys',
                area: {
                    color: 'Väri',
                    lineDash: 'Tyyli',
                    lineJoin: 'Kulmat',
                    width: 'Viivan paksuus'
                }
            }
        },
        FileInput: {
            drag: 'Raahaa {maxCount, plural, one {tiedosto} other {tiedostot}} tähän tai valitse selaamalla.',
            noFiles: 'Ei tiedostoja.',
            error: {
                invalidType: 'Tiedostomuoto ei ole sallittu.',
                allowedExtensions: 'Sallitut tiedostopäätteet: {allowedExtensions}.',
                multipleNotAllowed: 'Anna vain yksi tiedosto.',
                fileSize: 'Tiedoston koko on liian suuri. Suurin sallittu koko yksittäiselle tiedostolle on {maxSize, number} Mt.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Muut kielet',
            othersTip: 'Käännökset näytetään käytettäessä palvelua eri kielillä',
            locale: {
                generic: 'kielellä ({0})',
                fi: 'suomeksi',
                en: 'englanniksi',
                sv: 'ruotsiksi'
            }
        },
        Spin: {
            loading: 'Ladataan...'
        }
    }
});
