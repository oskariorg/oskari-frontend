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

const {
    API_KEY,
    CESIUM_ION,
    GROUPS,
    LOCALIZED_NAMES,
    ORGANIZATION_NAME,
    NAME,
    SRS,
    TILE_GRID,
    URL
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const GeneralTabPane = ({ mapLayerGroups, dataProviders, layer, capabilities, propertyFields, controller }) => (
    <Fragment>
        { propertyFields.some(propKey => [URL, CESIUM_ION, API_KEY].includes(propKey)) &&
            <ServiceEndPoint layer={layer} controller={controller} propertyFields={propertyFields} />
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
            <LocalizedNames layer={layer} controller={controller} />
        }
        { propertyFields.includes(ORGANIZATION_NAME) &&
            <DataProvider layer={layer} controller={controller} dataProviders={dataProviders} />
        }
        { propertyFields.includes(GROUPS) &&
            <Groups layer={layer} controller={controller} groups={mapLayerGroups} />
        }
    </Fragment>
);

GeneralTabPane.propTypes = {
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    bundleKey: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(GeneralTabPane);
export { contextWrap as GeneralTabPane };
