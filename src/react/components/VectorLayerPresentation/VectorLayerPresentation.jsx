import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Button, Badge, Select } from 'oskari-ui';
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

const REPLACE_ID = 'replaceFeatureId';

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

export const VectorLayerPresentation = ({ layer, updateAttributes, updateFeatureFilter = null, allowReplaceId = false }) => {

    const { data = {}, filter: featureFilter } = layer.attributes;

    const { geomName, featureProperties = []} = layer.capabilities;
    const [modal, setModal] = useState(null);

    // realtime changes reflected here
    const [draft, setDraft] = useState({
        filter: data.filter || {},
        locale: data.locale || {},
        format: data.format || {},
        featureFilter
    });

    // the "saved state" to revert to when pressing cancel in modals
    const [baseline, setBaseLine] = useState(() => {
        return structuredClone(data);
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(prev => {
            if (JSON.stringify(prev.locale) === JSON.stringify(data.locale) &&
                JSON.stringify(prev.filter) === JSON.stringify(data.filter) &&
                JSON.stringify(prev.format) === JSON.stringify(data.format)) {
                return prev;
            }

            const newState = {
                ...prev,
                locale: data.locale || {},
                filter: data.filter || {},
                format: data.format || {}
            };

            setBaseLine(structuredClone(newState));
            return newState;
        });
    }, [data.locale, data.filter, data.format]);

    const getButtonForModal = type => {
        const value = draft[type] || {};
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
            const filter = cleanFilter(draft.featureFilter, featureProperties);
            updateFeatureFilter(filter);
            // update local state
            onModalUpdate(filter);
            setModal(null);
            return;
        }


        // deep clone to not mess local state
        const value = structuredClone(draft[modal]);
        // clean twice to get rid of empty objects if last value is deleted from it
        clean(value);
        clean(value);

        if (Object.keys(value).length) {
            updateAttributes(modal, value);
        } else {
            updateAttributes(modal);
        }

        const newState = structuredClone(draft);
        delete newState[modal];
        if (value) {
            newState[modal] = value;
        }

        // save -> update base line & draft.
        setDraft(newState);
        setBaseLine(structuredClone(newState));
        setModal(null);
    };

    const onButtonClick = mode => {
        if (!featureProperties.length) {
            Messaging.warn(<Message messageKey='VectorLayerPresentation.attributes.messages.noFeatureProperties' bundleKey='oskariui'/>);
            return;
        }
        setModal(mode);
    };

    const onModalUpdate = (value) => {
        const newState = structuredClone(draft);
        delete newState[modal];
        if (value) {
            newState[modal] = value;
        }

        // update local draft
        setDraft(newState);
        // update parent state
        updateAttributes(modal, value);
    };

    const onModalCancel = () => {
        const attr = structuredClone(baseline[modal]) || {};
        const newState = structuredClone(draft);
        delete newState[modal];
        if (attr) {
            newState[modal] = attr;
        }
        setDraft(newState);
        setModal(null);
    };

    const properties = featureProperties.filter(prop => prop.name !== geomName);
    const propNames = properties.map(prop => prop.name);
    const propLabels = Oskari.getLocalized(data.locale) || {};
    // gather selected properties from all (localized) filters
    const selectedProperties = draft.filter ? [...new Set([].concat(...Object.values(draft.filter)))] : [];
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
                    { allowReplaceId &&
                        <>
                            <Message messageKey='VectorLayerPresentation.attributes.idProperty'/>
                            <InfoIcon title={<Message messageKey='VectorLayerPresentation.attributes.idPropertyTooltip'/>}/>
                            <StyledFormField>
                                <Select allowClear value={data[REPLACE_ID]}
                                    onChange={value => updateAttributes(REPLACE_ID, value)}
                                    options={propNames.map(value => ({value}))}/>
                            </StyledFormField>
                        </>
                    }
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
                            filter={draft.filter} labels={propLabels}/>
                    }
                    { modal === MODAL_TYPE.locale &&
                        <PropertiesLocale update={onModalUpdate} locale={draft.locale}
                            properties={propNames} selected={selectedProperties}/>
                    }
                    { modal === MODAL_TYPE.format &&
                        <PropertiesFormat update={onModalUpdate} properties={propNames}
                            format={draft.format} labels={propLabels} selected={selectedProperties}/>
                    }
                    { updateFeatureFilter && modal === MODAL_TYPE.featureFilter &&
                        <FeatureFilter onChange={onModalUpdate} properties={propNames}
                            filter={draft.featureFilter} labels={propLabels} types={properties}/>
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
