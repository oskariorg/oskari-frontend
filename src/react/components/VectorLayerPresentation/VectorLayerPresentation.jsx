import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Button, Badge } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { FeatureFilter, cleanFilter } from 'oskari-ui/components/FeatureFilter';
import { InfoIcon } from 'oskari-ui/components/icons';
import { LocaleProvider, Messaging } from 'oskari-ui/util';
import { PropertiesFilter } from './PropertiesFilter';
import { PropertiesLocale } from './PropertiesLocale';
import { PropertiesFormat } from './PropertiesFormat';
import { StyledFormField, Border } from './styled';

const MODAL_TYPE = {
    filter: 'filter',
    locale: 'locale',
    format: 'format',
    featureFilter: 'featureFilter'
};

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
        if(typeof val === 'object' && !Array.isArray(val) && val !== null) {
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

export const VectorLayerPresentation = ({ layer, updateAttributes, updateFeatureFilter = null }) => {
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
                    <Message messageKey={`VectorLayerPresentation.attributes.${type}.button`} />
                </Button>
            </Badge>
        );
    };

    const onModalOk = () => {
        if (modal === 'featureFilter') {
            const filter = cleanFilter(state.featureFilter, featureProperties);
            updateFeatureFilter(filter);
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
            updateAttributes(modal, value);
        } else {
            updateAttributes(modal);
        }
        // update local state
        onModalUpdate(value);
        setModal(null);
    };
    const onButtonClick = mode => {
        if (!featureProperties.length) {
            Messaging.warn(<Message messageKey='messages.noFeatureProperties' bundleKey='oskariui'/>);
            return;
        }
        setModal(mode);
    };
    const onModalUpdate = (value) => {
        setState({ ...state, [modal]: value });
    };
    const onModalCancel = () => {
        const attr = data[modal] || {};
        setState({ ...state, [modal]: attr });
        setModal(null);
    };

    const properties = featureProperties.filter(prop => prop.name !== geomName);
    const propNames = properties.map(prop => prop.name);
    const propLabels = Oskari.getLocalized(data.locale) || {};
    // gather selected properties from all (localized) filters
    const selectedProperties = state.filter ? [...new Set([].concat(...Object.values(state.filter)))] : [];
    return (
        <LocaleProvider value = {{ bundleKey: 'oskariui' }}>
            <Fragment>
                <Message messageKey='VectorLayerPresentation.attributes.properties'/>
                <Border>
                    { updateFeatureFilter &&
                        <StyledFormField>
                            { getButtonForModal(MODAL_TYPE.featureFilter) }
                        </StyledFormField>
                    }
                    <Message messageKey='VectorLayerPresentation.attributes.presentation' />
                    <InfoIcon title={<Message messageKey='VectorLayerPresentation.attributes.presentationTooltip'/>}/>
                    <StyledFormField>
                        <Buttons>
                            { getButtonForModal(MODAL_TYPE.filter) }
                            { getButtonForModal(MODAL_TYPE.locale) }
                            { getButtonForModal(MODAL_TYPE.format) }
                        </Buttons>
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
                    width={ modal === MODAL_TYPE.featureFilter ? 800 : 500 }
                >
                    <h3><Message messageKey={`VectorLayerPresentation.attributes.${modal}.title`} /></h3>
                    { modal === MODAL_TYPE.filter &&
                        <PropertiesFilter update={onModalUpdate} properties={propNames}
                            filter={state.filter} labels={propLabels}/>
                    }
                    { modal === MODAL_TYPE.locale &&
                        <PropertiesLocale update={onModalUpdate} locale={state.locale}
                            properties={propNames} selected={selectedProperties}/>
                    }
                    { modal === MODAL_TYPE.format &&
                        <PropertiesFormat update={onModalUpdate} properties={propNames}
                            format={state.format} labels={propLabels} selected={selectedProperties}/>
                    }
                    { updateFeatureFilter && modal === MODAL_TYPE.featureFilter &&
                        <FeatureFilter onChange={onModalUpdate} properties={propNames}
                            filter={state.featureFilter} labels={propLabels} types={properties}/>
                    }
                </Modal>
            </Fragment>
        </LocaleProvider>
    );
};

VectorLayerPresentation.propTypes = {
    layer: PropTypes.object.isRequired,
    updateAttributes: PropTypes.func.isRequired
};
