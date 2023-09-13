import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Divider, Button, Switch, TextInput, Select, Tooltip } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { recognizeChanges } from 'oskari-ui/components/StyleEditor/util'
import { IconButton } from 'oskari-ui/components/buttons';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { getGeometryType } from '../../../LayerHelper';
import { SUPPORTED_FORMATS } from 'oskari-ui/components/StyleEditor/constants';
import { EFFECT } from '../../../../../../mapping/mapmodule/oskariStyle/constants.js';

const Row = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 10px;
    & ${Select} {
        min-width: 200px;
    }
    & ${TextInput} {
        min-width: 200px;
    }
`;
const Space = styled.span`
    padding: 0px 5px;
    font-weight: bold;
`;

const RowItem = styled.span`
    display: flex;
    flex-flow: row nowrap;
    *:last-child {
        margin-left: 10px;
    }
`;

const effecOptions = Object.values(EFFECT).map(value => ({value, label: value}));

const ContentItem = ({index, item = {}, updateContent, properties = []}) => {
    const [ fromProperty, setFromProperty ] = useState(typeof item.keyProperty !== 'undefined');
    const labelKey = fromProperty ? 'keyProperty' : 'key';
    const onLabelChange = newContent => {
        // newContent to store only key or keyProperty
        if (item.valueProperty) {
            newContent.valueProperty = item.valueProperty;
        }
        updateContent(index, newContent);
    };
    return (
        <Row>
            <Tooltip title={<Message messageKey='styles.hover.fromProperty' />}>
                <Switch size='small' checked={fromProperty} onChange={setFromProperty} />
            </Tooltip>
            <Tooltip title={<Message messageKey={`styles.hover.labelTooltip.${labelKey}`} />}>
                { fromProperty
                    ? <Select value={item.keyProperty} options={properties} onChange={keyProperty => onLabelChange({keyProperty})} />
                    : <TextInput type='text' value={item[labelKey]} onChange={evt => onLabelChange({ key: evt.target.value })}/>
                }
            </Tooltip>
            <Space>:</Space>
            <Select value={item.valueProperty} allowClear
                options={properties} onChange={valueProperty => updateContent(index, { ...item, valueProperty })} />
            <IconButton bordered type='delete' onClick={() => updateContent(index)} />
        </Row>
    );
};

export const HoverModal = ({ layer, controller }) => {
    const { hover = {} } = layer.options; 
    const [ content, setContent ] = useState(hover.content);
    const [ featureStyle, setFeatureStyle ] = useState(hover.featureStyle);
    const [ open, setOpen ] = useState(false);
    const [ useStyle, setUseStyle ] = useState(false);

    const { geomName, featureProperties = []} = layer.capabilities;
    // const labels = Oskari.getLocalized(layer.attributes.data.locale) || {};
    const properties = featureProperties.filter(prop => prop.name !== geomName).map(prop => ({ value: prop.name }));
    const save = () => {
        if (!content && !featureStyle) {
            // remove hover
            controller.setHover();
            return;
        }
        const { inherit, effect, ...styleDef } = featureStyle;
        let style = featureStyle;
        if (!useStyle) {
            style = { inherit, effect };
        } else if (inherit) {
            style = {
                inherit,
                effect,
                ...recognizeChanges(Oskari.custom.getDefaultStyle(), styleDef)
            };
        }
        controller.setHover({ featureStyle: style, content });
        setOpen(false);
    };
    const onClose = () => {
        setFeatureStyle(hover.featureStyle);
        setContent(hover.content);
        setOpen(false);
    };
    const updateContent = (index, updated) => {
        const newContent = updated
            ? content.map((item, i) => i === index ? updated : item)
            : content.filter((item, i) => i !== index);
        setContent(newContent);
    };
    const geometryType = getGeometryType(layer);
    const styleTabs = SUPPORTED_FORMATS.includes(geometryType) ? [geometryType] : SUPPORTED_FORMATS;
    
    return (
        <Fragment>
            <StyledFormField>
                <Button onClick={() => setOpen(true)}>
                    <Message messageKey='styles.hover.title' />
                </Button>
            </StyledFormField>
            <Modal
                destroyOnClose
                mask={ false }
                maskClosable= { false }
                open={ open }
                onOk={ save }
                onCancel={ onClose }
                cancelText={ <Message messageKey="cancel" /> }
                okText={ <Message messageKey="save" /> }
                title={<Message messageKey='styles.hover.title' />}
                width={ 600 }>

                <Divider>
                    <RowItem>
                        <Message messageKey='styles.hover.tooltip' />
                        <IconButton type='add' title={null} onClick={() => setContent([...content, {}])} />
                    </RowItem>
                </Divider>
                {content?.map((item, i) => <ContentItem key={i} properties={properties} index={i} updateContent={updateContent} item={item} />)}
                <Divider><Message messageKey='styles.vector.featureStyle' /></Divider>
                <Row>
                    <RowItem>
                        <Switch size='small' checked={featureStyle?.inherit || false} onChange={inherit => setFeatureStyle({...featureStyle, inherit })} />
                        <Message messageKey='styles.hover.inherit' />
                    </RowItem>
                    <RowItem>
                        <Message messageKey='styles.hover.effect' />
                        <Select value={featureStyle?.effect}
                            options={effecOptions} onChange={effect => setFeatureStyle({...featureStyle, effect })} />
                    </RowItem>
                </Row>
                <RowItem>
                    <Switch size='small' checked={useStyle} onChange={value => setUseStyle(value)} />
                    <Message messageKey='styles.hover.useStyle' />
                </RowItem>
                { useStyle && <StyleEditor tabs={styleTabs}
                    oskariStyle={ featureStyle }
                    onChange={updated => setFeatureStyle({ ...featureStyle, ...updated })}/>
                }
            </Modal>
        </Fragment>
    );
};

HoverModal.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
