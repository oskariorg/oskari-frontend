import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Srs } from './Srs';
import { ServiceEndPoint } from '../../ServiceEndPoint';
import { Name } from './Name';
import { LocalizedNames } from './LocalizedNames';
import { DataProvider } from './DataProvider';
import { Groups } from './Groups';
import { TileGrid } from './TileGrid';
import { Version } from './Version';
import { Mandatory } from '../Mandatory';

const {
    API_KEY,
    CESIUM_ION,
    GROUPS,
    LOCALIZED_NAMES,
    ORGANIZATION_NAME,
    NAME,
    SRS,
    TILE_GRID,
    URL,
    VERSION
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const GeneralTabPane = ({ mapLayerGroups, dataProviders, versions, layer, capabilities, propertyFields, controller }) => (
    <Fragment>
        { propertyFields.some(propKey => [URL, CESIUM_ION, API_KEY].includes(propKey)) &&
            <ServiceEndPoint layer={layer} controller={controller} propertyFields={propertyFields} />
        }
        { propertyFields.includes(VERSION) &&
            <Version layer={layer} versions={versions} controller={controller} />
        }
        { propertyFields.includes(SRS) &&
            <Srs layer={layer} controller={controller} propertyFields={propertyFields} capabilities={capabilities} />
        }
        { propertyFields.includes(TILE_GRID) &&
            <TileGrid layer={layer} controller={controller} />
        }
        { propertyFields.includes(NAME) &&
            <Name layer={layer} controller={controller} />
        }
        { propertyFields.includes(LOCALIZED_NAMES) &&
            <Mandatory><LocalizedNames layer={layer} controller={controller} /></Mandatory>
        }
        { propertyFields.includes(ORGANIZATION_NAME) &&
            <Mandatory><DataProvider layer={layer} controller={controller} dataProviders={dataProviders} /></Mandatory>
        }
        { propertyFields.includes(GROUPS) &&
            <Groups layer={layer} controller={controller} groups={mapLayerGroups} />
        }
    </Fragment>
);

GeneralTabPane.propTypes = {
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    bundleKey: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(GeneralTabPane);
export { contextWrap as GeneralTabPane };
