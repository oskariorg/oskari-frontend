import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerCollapse } from '../../LayerCollapse';
import { LayerGroup } from '../../../../layerselector2/model/LayerGroup.class';
import { Oskari, AbstractLayer } from './mock';
import { LayerCollapseService } from '../LayerCollapseService';

window.Oskari = Oskari;

let lyrCount = 0;
const createLayer = (name, type) => {
    const layer = new AbstractLayer();
    lyrCount++;
    layer._name = name;
    layer.setType(type);
    layer.setId(lyrCount);
    return layer;
};

const createLayers = () => {
    wms = createLayer('WMS layer', 'wmslayer');
    const layers = [
        wms,
        createLayer('WFS layer', 'wfs'),
        createLayer('WMTS layer', 'wmtslayer')
    ];
    return layers;
};

const createLayerGroups = layers => {
    const groups = [
        new LayerGroup('Background layers'),
        new LayerGroup('Data layers'),
        new LayerGroup('User layers')
    ];
    groups.forEach((group, index) => {
        if (index % 2 === 0) {
            group.addLayer(layers[1]);
        }
        if (index % 3 === 0) {
            group.addLayer(layers[2]);
        }
        group.addLayer(layers[0]);
    });
    return groups;
};

const service = new LayerCollapseService();
let groups = [];
let layers = [];
let wms = null;

const resetStoryState = () => {
    layers = createLayers();
    groups = createLayerGroups(layers);
    service.setState({
        groups,
        filterKeyword: '',
        selectedLayerIds: []
    });
};

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

storiesOf('LayerCollapse', module)

    .add('empty', () => {
        resetStoryState();
        service.setState({
            groups: []
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with groups', () => {
        resetStoryState();
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with filter "wfs"', () => {
        resetStoryState();
        service.setState({
            filterKeyword: 'wfs'
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with filter "wms"', () => {
        resetStoryState();
        service.setState({
            filterKeyword: 'wms'
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('WMS selected', () => {
        resetStoryState();
        service.setState({
            selectedLayerIds: [wms.getId()]
        });
        const state = service.getState();
        state.openGroupTitles = groups.map(cur => cur.getTitle());
        return <LayerCollapse {...state} locale={locale} />;
    })
    .add('Sticky WMS', () => {
        resetStoryState();
        service.setState({
            selectedLayerIds: [wms.getId()]
        });
        const state = service.getState();
        state.openGroupTitles = groups.map(cur => cur.getTitle());
        wms.setSticky(true);
        return <LayerCollapse {...state} locale={locale} />;
    });
