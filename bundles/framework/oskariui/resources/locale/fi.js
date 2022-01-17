Oskari.registerLocalization({
    lang: 'fi',
    key: 'oskariui',
    value: {
        error: {
            generic: 'Tapahtui odottamaton virhe'
        },
        table: {
            sort: {
                desc: 'Lajittele laskevasti',
                asc: 'Lajittele nousevasti',
                cancel: 'Peruuta lajittelu'
            }
        },
        StyleEditor: {
            newtitle: 'Uusi tyyli',
            subheaders: {
                styleFormat: 'Geometriatyyppi',
                name: 'Tyylin nimi',
                style: 'Style',
                pointTab: 'Piste',
                lineTab: 'Viiva',
                areaTab: 'Alue'
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
                    color: 'Täyttöväri'
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
            othersTip: 'Käännökset näytetään käytettäessä palvelua eri kielillä.',
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
