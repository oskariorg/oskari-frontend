const locale = {
    'errors': {
        'title': 'Virhe',
        'generic': 'Järjestelmässä tapahtui virhe.',
        'loadFailed': 'Karttatasojen lataaminen epäonnistui. Päivitä sivu selaimessasi ja valitse karttatasot uudelleen.',
        'noResults': 'Hakutuloksia ei löytynyt. Tarkista hakusana ja yritä uudelleen.',
        'noResultsForKeyword': 'Karttatasoja ei löytynyt. Tarkista hakusana ja yritä uudelleen.',
        'minChars': 'Antamasi hakusana on liian lyhyt. Hakusanassa on oltava vähintään neljä merkkiä.'
    },
    'loading': 'Haetaan...',
    'filter': {
        'text': 'Hae karttatasoja',
        'keywordsTitle': 'Avainsanat',
        'shortDescription': 'Hae karttatasoa karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella.',
        'description': 'Voit hakea karttatasoa karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella. Voit kirjoittaa nimen kokonaan tai vain osan nimestä. Hakusanassa on oltava vähintään neljä merkkiä.',
        'inspire': 'Aiheittain',
        'organization': 'Tiedontuottajittain',
        'published': 'Käyttäjät',
        'didYouMean': 'Tarkoititko:'
    },
    'published': {
        'organization': 'Julkaistu karttataso',
        'inspire': 'Julkaistu karttataso'
    },
    'tooltip': {
        'type-base': 'Taustakartta',
        'type-wms': 'Karttataso',
        'type-wfs': 'Tietotuote',
        'type-wfs-manual': 'Päivitä kohdetiedot kartalla klikkaamalla Kohdetiedot- tai Päivitä-painiketta karttanäkymässä.',
        'type-timeseries': 'Aikasarjataso',
        'unsupported-srs': 'Väärä karttaprojektio'
    },
    'backendStatus': {
        'OK': {
            'tooltip': 'Karttataso on käytettävissä tällä hetkellä.',
            'iconClass': 'backendstatus-ok'
        },
        'DOWN': {
            'tooltip': 'Karttataso ei tällä hetkellä käytettävissä.',
            'iconClass': 'backendstatus-down'
        },
        'ERROR': {
            'tooltip': 'Karttataso ei tällä hetkellä käytettävissä.',
            'iconClass': 'backendstatus-error'
        },
        'MAINTENANCE': {
            'tooltip': 'Karttataso voi olla ajoittain poissa käytöstä lähipäivinä.',
            'iconClass': 'backendstatus-maintenance'
        },
        'UNKNOWN': {
            'tooltip': '',
            'iconClass': 'backendstatus-unknown'
        },
        'UNSTABLE': {
            'tooltip': '',
            'iconClass': 'backendstatus-unstable'
        }
    }
};
export { locale };
