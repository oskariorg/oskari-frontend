import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option, Space, Button } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { Controller } from 'oskari-ui/util';
import { PropertiesFilter, PropertiesLocale, PropertiesFormatter } from './VectorLayerAttributes/';
import { StyledFormField } from '../styled';
import { InfoTooltip } from '../InfoTooltip';
import { GEOMETRY_TYPES, getGeometryType } from '../../LayerHelper';

export const VectorLayerAttributes = ({ layer, controller }) => {
    const { data = {} } = layer.attributes;
    const { geomName, featureProperties = []} = layer.capabilities;
    const [modal, setModal] = useState(null);
    const [state, setState] = useState({
        filter: data.filter || {},
        locale: data.locale || {},
        format: data.format || {}
    });

    const onGeometryTypeChange = value => {
        if (GEOMETRY_TYPES[0] === value) {
            controller.setAttributesData('geometryType');
        } else {
            controller.setAttributesData('geometryType', value);
        }
    };
    const onModalOk = () => {
        // TODO: clean empty objects??
        controller.setAttributesData(modal, state[modal]);
        setModal(null);
    };
    const onButtonClick = mode => {
        if (!featureProperties.length) {
            // nothing to see, TODO: notify
            return;
        }
        setModal(mode);
    };
    const onModalUpdate = (value) => {
        setState({ ...state, [modal]: value });
    };
    const propNames = featureProperties.filter(prop => prop.name !== geomName).map(prop => prop.name);
    const geometryTypeSource = data.geometryType ? 'Attributes' : 'Capabilities';
    const propLabels = Oskari.getLocalized(data.locale) || {};

    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <InfoTooltip messageKeys={`attributes.geometryType.source${geometryTypeSource}`}/>
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
            <Message messageKey='attributes.properties' />
            <StyledFormField>
                <Space direction='horizontal'>
                    <Button onClick={() => onButtonClick('filter')}>
                        <Message messageKey='attributes.filter.button' />
                    </Button>
                    <Button onClick={() => onButtonClick('locale')}>
                        <Message messageKey='attributes.locale.button' />
                    </Button>
                    <Button onClick={() => onButtonClick('format')}>
                        <Message messageKey='attributes.formatter.button' />
                    </Button>
                </Space>
            </StyledFormField>
            <Modal
                mask={ false }
                maskClosable= { false }
                open={ !!modal }
                onOk={ () => onModalOk() }
                onCancel={ () => setModal(null) }
                cancelText={ <Message messageKey="cancel" /> }
                okText={ <Message messageKey="save" /> }
                width={ 500 }
            >
                <h3><Message messageKey={`attributes.${modal}.title`} /></h3>
                { modal === 'filter' &&
                    <PropertiesFilter update={onModalUpdate} properties={propNames}
                        filter={state.filter} labels={propLabels}/>
                }
                { modal === 'locale' &&
                    <PropertiesLocale update={onModalUpdate} locale={state.locale} properties={propNames}/>
                }
                { modal === 'format' &&
                    <PropertiesFormatter update={onModalUpdate} properties={propNames}
                        format={state.format} labels={propLabels}/>
                }
            </Modal>
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
