import React from 'react';
import PropTypes from 'prop-types';
import { StyledTab } from '../StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Srs } from './Srs';
import { Url } from './Url';
import { Name } from './Name';
import { LocalizedNames } from './LocalizedNames';
import { DataProvider } from './DataProvider';
import { MapLayerGroups } from './MapLayerGroups';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const GeneralTabPane = ({ mapLayerGroups, dataProviders, layer, capabilities, propertyFields, controller }) => (
    <StyledTab>
        { propertyFields.includes(LayerComposingModel.URL) &&
            <Url layer={layer} controller={controller} propertyFields={propertyFields} />
        }
        { propertyFields.includes(LayerComposingModel.SRS) &&
            <Srs layer={layer} controller={controller} propertyFields={propertyFields} capabilities={capabilities} />
        }
        { propertyFields.includes(LayerComposingModel.NAME) &&
            <Name layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.LOCALIZED_NAMES) &&
            <LocalizedNames layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.ORGANIZATION_NAME) &&
            <DataProvider layer={layer} controller={controller} dataProviders={dataProviders} />
        }
        { propertyFields.includes(LayerComposingModel.GROUPS) &&
            <MapLayerGroups layer={layer} controller={controller} mapLayerGroups={mapLayerGroups} />
        }
    </StyledTab>
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
