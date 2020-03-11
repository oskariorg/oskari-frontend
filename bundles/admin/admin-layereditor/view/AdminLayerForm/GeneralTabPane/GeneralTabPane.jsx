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

const GeneralTabPane = ({ mandatoryFields, mapLayerGroups, dataProviders, versions, layer, capabilities, propertyFields, controller }) => (
    <Fragment>
        { wrapMandatory(mandatoryFields, 'url', getEndpointField(layer, propertyFields, controller)) }
        { wrapMandatory(mandatoryFields, 'version', getVersionField(layer, propertyFields, controller, versions)) }
        { wrapMandatory(mandatoryFields, 'srs', getSRSField(layer, propertyFields, controller, capabilities)) }
        { wrapMandatory(mandatoryFields, 'tilegrid', getTileGridField(layer, propertyFields, controller)) }
        { wrapMandatory(mandatoryFields, 'name', getNameField(layer, propertyFields, controller)) }
        { wrapMandatory(mandatoryFields, 'locale', getLocaleField(layer, propertyFields, controller)) }
        { wrapMandatory(mandatoryFields, 'dataproviderId', getDataproviderField(layer, propertyFields, controller, dataProviders)) }
        { wrapMandatory(mandatoryFields, 'groups', getGroupsField(layer, propertyFields, controller, mapLayerGroups)) }
    </Fragment>
);

const wrapMandatory = (mandatoryFields = [], name, field) => {
    if (!field) {
        return null;
    }
    if (mandatoryFields.includes(name)) {
        return <Mandatory>{field}</Mandatory>;
    }
    return field;
};

const getEndpointField = (layer, propertyFields, controller) => {
    if (!propertyFields.some(propKey => [URL, CESIUM_ION, API_KEY].includes(propKey))) {
        return null;
    }
    return (<ServiceEndPoint layer={layer} controller={controller} propertyFields={propertyFields} />);
};

const getVersionField = (layer, propertyFields, controller, versions) => {
    if (!propertyFields.includes(VERSION)) {
        return null;
    }
    return (<Version layer={layer} versions={versions} controller={controller} />);
};

const getSRSField = (layer, propertyFields, controller, capabilities) => {
    if (!propertyFields.includes(SRS)) {
        return null;
    }
    return (<Srs layer={layer} controller={controller} propertyFields={propertyFields} capabilities={capabilities} />);
};

const getTileGridField = (layer, propertyFields, controller) => {
    if (!propertyFields.includes(TILE_GRID)) {
        return null;
    }
    return (<TileGrid layer={layer} controller={controller} />);
};

const getNameField = (layer, propertyFields, controller) => {
    if (!propertyFields.includes(NAME)) {
        return null;
    }
    return (<Name layer={layer} controller={controller} />);
};

const getLocaleField = (layer, propertyFields, controller) => {
    if (!propertyFields.includes(LOCALIZED_NAMES)) {
        return null;
    }
    return (<Mandatory><LocalizedNames layer={layer} controller={controller} /></Mandatory>);
};

const getDataproviderField = (layer, propertyFields, controller, dataProviders) => {
    if (!propertyFields.includes(ORGANIZATION_NAME)) {
        return null;
    }
    return (<Mandatory><DataProvider layer={layer} controller={controller} dataProviders={dataProviders} /></Mandatory>);
};

const getGroupsField = (layer, propertyFields, controller, mapLayerGroups) => {
    if (!propertyFields.includes(GROUPS)) {
        return null;
    }
    return (<Groups layer={layer} controller={controller} groups={mapLayerGroups} />);
};

GeneralTabPane.propTypes = {
    mandatoryFields: PropTypes.array,
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
