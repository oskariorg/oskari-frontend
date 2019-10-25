Oskari.registerLocalization(
    {
        'lang': 'fi',
        'key': 'LayerList',
        'value': {
            'title': 'Karttatasot',
            'desc': '',
            'errors': {
                'loadFailed': 'Karttatasojen lataaminen epäonnistui. Päivitä sivu selaimessasi ja valitse karttatasot uudelleen.',
                'noResults': 'Hakutuloksia ei löytynyt. Tarkista hakusana ja yritä uudelleen.'
            },
            'tabs': {
                'layerList': 'Hae karttatasoja',
                'selectedLayers': 'Valitut tasot'
            },
            'filter': {
                'title': 'Näytä',
                'placeholder': 'Kaikki karttatasot',
                'search': {
                    'placeholder': 'Hae karttatasoa nimen, tiedontuottajan tai avainsanan perusteella',
                    'tooltip': 'Voit hakea karttatasoa nimen, tiedontuottajan tai avainsanan perusteella. Voit kirjoittaa nimen kokonaan tai vain osan nimestä.',    
                },
                'newest': {
                    'title': 'Uusimmat',
                    'tooltip': 'Näytä ## uusinta karttatasoa'
                }
            },
            'grouping': {
                'title': 'Ryhmittely',
                'inspire': 'Aiheittain',
                'organization': 'Tiedontuottajittain'
            },
            'tooltip': {
                'type-base': 'Taustakartta',
                'type-wms': 'Karttataso',
                'type-wfs': 'Tietotuote',
                'type-timeseries': 'Aikasarjataso',
                'addLayer': 'Lisää karttataso'
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
            },
            'guidedTour': {
                'title': 'Karttatasot',
                'message': 'Karttatasot-valikosta löydät kaikki karttapalvelussa saatavilla olevat karttatasot. <br/><br/> Järjestä karttatasot joko aiheen tai tiedontuottajan mukaan. <br/><br/> Hae karttatasoja karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella. Löydät uusimmat karttatasot, vektoritasot ja julkaistavissa olevat karttatasot valmiiksi määritellyiltä listoilta. <br/><br/>  Avoinna olevat karttatasot voit tarkistaa Valitut tasot -valikosta.',
                'openLink': 'Näytä Karttatasot',
                'closeLink': 'Piilota Karttatasot',
                'tileText': 'Karttatasot'
            }
        }
    });
