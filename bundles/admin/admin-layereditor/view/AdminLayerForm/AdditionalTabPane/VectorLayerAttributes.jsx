import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Option, Button, Badge } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { FeatureFilter, cleanFilter } from 'oskari-ui/components/FeatureFilter';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Controller, Messaging } from 'oskari-ui/util';
import { PropertiesFilter, PropertiesLocale, PropertiesFormat } from './VectorLayerAttributes/';
import { StyledFormField, Border } from '../styled';
import { GEOMETRY_TYPES, getGeometryType } from '../../LayerHelper';

const Buttons = styled.div`
    display: inline-flex;
    > * {
        margin-right: 20px;
    }
`;

// Clean empty objects and values that doesn't need to store
// data.format: false options
// data.locale: empty strings
const clean = obj => {
    for (const key in obj) {
        const val = obj[key];
        if(typeof val === "object" && !Array.isArray(val) && val !== null) {
            if (!Object.keys(val).length) {
                delete obj[key];
            } else {
                clean(val);
            }
        } else if (typeof val === 'string' && !val.trim().length) {
            delete obj[key];
        } else if (val === null || val === false) {
            delete obj[key];
        }
    }
};

export const VectorLayerAttributes = ({ layer, controller }) => {
    const { data = {}, filter: featureFilter } = layer.attributes;
    const { geomName, featureProperties = []} = layer.capabilities;
    const [modal, setModal] = useState(null);
    const [state, setState] = useState({
        filter: data.filter || {},
        locale: data.locale || {},
        format: data.format || {},
        featureFilter
    });
    const getButtonForModal = type => {
        const value = state[type] || {};
        const count = Object.keys(value).length;
        return (
            <Badge count={count} showZero={false}>
                <Button onClick={() => onButtonClick(type)}>
                    <Message messageKey={`attributes.${type}.button`} />
                </Button>
            </Badge>
        );
    };

    const onGeometryTypeChange = value => {
        if (GEOMETRY_TYPES[0] === value) {
            controller.setAttributesData('geometryType');
        } else {
            controller.setAttributesData('geometryType', value);
        }
    };
    const onModalOk = () => {
        if (modal === 'featureFilter') {
            const filter = cleanFilter(state.featureFilter, featureProperties);
            controller.setFeatureFilter(filter);
            // update local state
            onModalUpdate(filter);
            setModal(null);
            return;
        }
        // deep clone to not mess local state
        const value = JSON.parse(JSON.stringify(state[modal]));
        // clean twice to get rid of empty objects if last value is deleted from it
        clean(value);
        clean(value);
        if (Object.keys(value).length) {
            controller.setAttributesData(modal, value);
        } else {
            controller.setAttributesData(modal);
        }
        // update local state
        onModalUpdate(value);
        setModal(null);
    };
    const onButtonClick = mode => {
        if (!featureProperties.length) {
            Messaging.warn(<Message messageKey='messages.noFeatureProperties' bundleKey='admin-layereditor'/>);
            return;
        }
        setModal(mode);
    };
    const onModalUpdate = (value) => {
        setState({ ...state, [modal]: value });
    };
    const onModalCancel = () => {
        const attr = modal === 'featureFilter' ? featureFilter : data[modal] || {};
        setState({ ...state, [modal]: attr });
        setModal(null);
    };
    const properties = featureProperties.filter(prop => prop.name !== geomName);
    const propNames = properties.map(prop => prop.name);
    const geometryTypeSource = data.geometryType ? 'Attributes' : 'Capabilities';
    const propLabels = Oskari.getLocalized(data.locale) || {};
    // gather selected properties from all (localized) filters
    const selectedProperties = state.filter ? [...new Set([].concat(...Object.values(state.filter)))] : [];
    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <InfoIcon title={<Message messageKey={`attributes.geometryType.source${geometryTypeSource}`}/>}/>
            <StyledFormField>
                <Select
                    value={getGeometryType(layer)}
                    onChange={onGeometryTypeChange}>
                    { GEOMETRY_TYPES.map(type => (
                        <Option key={type} value={type}>
                            <Message messageKey={`attributes.geometryType.${type}`} />
                        </Option>
                    )) }
                </Select>
            </StyledFormField>
            <Message messageKey='attributes.properties'/>
            <Border>
                <StyledFormField>
                    { getButtonForModal('featureFilter') }
                </StyledFormField>
                <Message messageKey='attributes.presentation' />
                <InfoIcon title={<Message messageKey='attributes.presentationTooltip'/>}/>
                <StyledFormField>
                    <Buttons>
                        { getButtonForModal('filter') }
                        { getButtonForModal('locale') }
                        { getButtonForModal('format') }
                    </Buttons>
                </StyledFormField>
                <Message messageKey='attributes.idProperty'/>
                <InfoIcon title={<Message messageKey='attributes.idPropertyTooltip'/>}/>
                <StyledFormField>
                    <Select allowClear value={data.idProperty}
                        onChange={value => controller.setAttributesData('idProperty', value)}
                        options={propNames.map(value => ({value}))}/>
                </StyledFormField>
            </Border>
            <Modal
                mask={ false }
                maskClosable= { false }
                open={ !!modal }
                onOk={ onModalOk}
                onCancel={ onModalCancel }
                cancelText={ <Message messageKey="cancel" /> }
                okText={ <Message messageKey="save" /> }
                width={ modal === 'featureFilter' ? 800 : 500 }
            >
                <h3><Message messageKey={`attributes.${modal}.title`} /></h3>
                { modal === 'filter' &&
                    <PropertiesFilter update={onModalUpdate} properties={propNames}
                        filter={state.filter} labels={propLabels}/>
                }
                { modal === 'locale' &&
                    <PropertiesLocale update={onModalUpdate} locale={state.locale}
                        properties={propNames} selected={selectedProperties}/>
                }
                { modal === 'format' &&
                    <PropertiesFormat update={onModalUpdate} properties={propNames}
                        format={state.format} labels={propLabels} selected={selectedProperties}/>
                }
                { modal === 'featureFilter' &&
                    <FeatureFilter onChange={onModalUpdate} properties={propNames}
                        filter={state.featureFilter} labels={propLabels} types={properties}/>
                }
            </Modal>
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
