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
import { LayerTypeNotSupported } from '../LayerTypeNotSupported';

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

const GeneralTabPane = ({ validators, mapLayerGroups, dataProviders, versions, layer, propertyFields, controller }) => {
    const isLayerTypeSupported = propertyFields.length > 0;
    if (!isLayerTypeSupported) {
        return (<LayerTypeNotSupported type={layer.type} />);
    }
    return (
        <Fragment>
            { wrapMandatory(validators, layer, 'url', getEndpointField(layer, propertyFields, controller)) }
            { wrapMandatory(validators, layer, 'version', getVersionField(layer, propertyFields, controller, versions)) }
            { wrapMandatory(validators, layer, 'srs', getSRSField(layer, propertyFields, controller)) }
            { wrapMandatory(validators, layer, 'options.tileGrid', getTileGridField(layer, propertyFields, controller)) }
            { wrapMandatory(validators, layer, 'name', getNameField(layer, propertyFields, controller)) }
            { wrapMandatory(validators, layer, `locale.${Oskari.getSupportedLanguages()[0]}.name`, getLocaleField(layer, propertyFields, controller)) }
            { wrapMandatory(validators, layer, 'dataProviderId', getDataproviderField(layer, propertyFields, controller, dataProviders)) }
            { wrapMandatory(validators, layer, 'groups', getGroupsField(layer, propertyFields, controller, mapLayerGroups)) }
        </Fragment>
    );
};

// TODO: this isn't as elegant as it could. Maybe refactor so we can loop the field names and get Fields and
// validators/Mandatory based on that
const wrapMandatory = (validators = {}, layer, name, field) => {
    if (!field) {
        return null;
    }
    const validatorFunc = validators[name];
    if (typeof validatorFunc === 'function') {
        return <Mandatory isValid={validatorFunc(layer)}>{field}</Mandatory>;
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

const getSRSField = (layer, propertyFields, controller) => {
    if (!propertyFields.includes(SRS)) {
        return null;
    }
    return (<Srs layer={layer} controller={controller} propertyFields={propertyFields} />);
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
    return (<LocalizedNames layer={layer} controller={controller} />);
};

const getDataproviderField = (layer, propertyFields, controller, dataProviders) => {
    if (!propertyFields.includes(ORGANIZATION_NAME)) {
        return null;
    }
    return (<DataProvider layer={layer} controller={controller} dataProviders={dataProviders} />);
};

const getGroupsField = (layer, propertyFields, controller, mapLayerGroups) => {
    if (!propertyFields.includes(GROUPS)) {
        return null;
    }
    return (<Groups layer={layer} controller={controller} groups={mapLayerGroups} />);
};

GeneralTabPane.propTypes = {
    validators: PropTypes.object,
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    layer: PropTypes.object.isRequired,
    bundleKey: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(GeneralTabPane);
export { contextWrap as GeneralTabPane };
