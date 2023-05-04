import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { VectorStyleSelect } from './VectorStyle/VectorStyleSelect';
import { VectorNameInput } from './VectorStyle/VectorNameInput';
import { VectorStyleJson } from './VectorStyle/VectorStyleJson';
import { LocaleConsumer, Messaging, Controller } from 'oskari-ui/util';
import { Button, Message, Space } from 'oskari-ui';
import { EditOutlined, BgColorsOutlined } from '@ant-design/icons';
import { Modal } from 'oskari-ui/components/Modal';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';

const FullWidthSpace = styled(Space)`
    & {
        padding: 5px 0 10px;
        width: 100%;
    }
`;

const getExternalStyleType = (layer) => {
    const { type } = layer;
    if (type === 'tiles3dlayer') {
        return 'cesium';
    }
    if (type === 'vectortilelayer') {
        return 'mapbox';
    }
    throw new Error(`Unknown layer type (${type}). Tried to get external vector style type)`);
};
const parseJsonStyle = (mode, style) => {
    let parsed = {};
    const parse = json => {
        try {
            return JSON.parse(json);
        } catch { /* ignored */ }
    };
    if (mode === 'json') {
        const featureStyle = parse(style.featureStyle);
        if (typeof featureStyle === 'object') {
            parsed.featureStyle = featureStyle;
        }
        const optionalStyles = parse(style.optionalStyles);
        if (Array.isArray(optionalStyles)) {
            parsed.optionalStyles = optionalStyles;
        }
    } else if (mode === 'external') {
        const ext = parse(style);
        if (typeof ext === 'object') {
            parsed = ext;
        }
    }
    return Object.keys(parsed).length ? parsed : null;
};
const stringify = (json) => {
    try {
        return JSON.stringify(json, null, 2) || '';
    } catch { /* ignored */ }
    return '';
};
const getRuntimeId = () => Date.now().valueOf(); // Long in backend

export const VectorStyle = ThemeConsumer(LocaleConsumer(({ theme = {}, layer, getMessage, controller, external }) => {
    const newStyleName = getMessage('styles.vector.newStyleName');
    const [state, setState] = useState({
        modal: null
    });
    const hasValidName = () => typeof state.name === 'string' && state.name.trim().length > 0;

    const onModalClose = () => setState({ modal: null });
    const setName = (name) => setState({ ...state, name });
    const updateStyle = (style) => setState({ ...state, style });
    const addStyle = (mode, template) => setState({ id: getRuntimeId(), name: newStyleName, style: template, modal: mode });
    const editStyle = (mode, vectorStyle) => {
        const { style, ...state } = vectorStyle;
        if (mode === 'json') {
            if (state.type === 'oskari') {
                const { featureStyle, optionalStyles } = style;
                state.style = {
                    featureStyle: stringify(featureStyle),
                    optionalStyles: stringify(optionalStyles)
                };
            } else {
                mode = 'external';
                state.style = stringify(style);
            }
        } else {
            state.style = style;
        }
        state.modal = mode;
        state.isEdit = true;
        setState(state);
    };
    const onModalOk = () => {
        const mode = state.modal;
        const toSave = {
            id: state.id,
            name: hasValidName() ? state.name : newStyleName,
            style: mode === 'editor' ? state.style : parseJsonStyle(mode, state.style),
            type: mode === 'external' ? getExternalStyleType(layer) : 'oskari'
        };
        if (!toSave.style) {
            Messaging.error(getMessage('styles.vector.validation.json'));
            return;
        }
        controller.saveVectorStyleToLayer(toSave, state.isEdit);
        onModalClose();
    };
    const visible = !!state.modal;
    const externalType = external ? getExternalStyleType(layer) : null;
    return (
        <FullWidthSpace direction='vertical'>
            <Space direction='horizontal'>
                <Button
                    onClick={ () => {
                        const style = {
                            ...OSKARI_BLANK_STYLE,
                            fill: {
                                ...OSKARI_BLANK_STYLE.fill,
                                color: theme.color.primary
                            },
                            image: {
                                ...OSKARI_BLANK_STYLE.image,
                                fill: {
                                    ...OSKARI_BLANK_STYLE.image.fill,
                                    color: theme.color.primary
                                }
                            }
                        };
                        addStyle('editor', { featureStyle: style }) }
                    }
                >
                    <BgColorsOutlined/>&nbsp;
                    <Message messageKey="styles.vector.add.editor" />
                </Button>
                <Button onClick={ () => addStyle('json', { featureStyle: '', optionalStyles: '' }) }>
                    <EditOutlined/>&nbsp;
                    <Message messageKey="styles.vector.add.json" />
                </Button>
                { external &&
                    <Button onClick={ () => addStyle('external', '') }>
                        <EditOutlined/>&nbsp;
                        <Message messageKey={`styles.vector.add.${externalType}`}/>
                    </Button>
                }
            </Space>
            <Modal
                mask={ false }
                maskClosable= { false }
                open={ visible }
                onOk={ onModalOk }
                onCancel={ onModalClose }
                cancelText={ <Message messageKey="cancel" /> }
                okText={ <Message messageKey="save" /> }
                width={ 620 }
            >
                <VectorNameInput
                    styleName={ state.name }
                    isValid={ hasValidName() }
                    onChange={ setName }
                    nameFieldHeader={ <Message messageKey={ 'styles.vector.name' } /> }
                    validationErrorMessage={ <Message messageKey='styles.vector.validation.name' /> }
                />

                { state.modal === 'editor' &&
                    <StyleEditor
                        oskariStyle={ state.style.featureStyle }
                        onChange={ (featureStyle) => updateStyle({ featureStyle })}
                    />
                }
                { state.modal === 'json' &&
                    <Fragment>
                        <VectorStyleJson type='featureStyle'
                            style={ state.style.featureStyle }
                            onChange={ (featureStyle) => updateStyle({ ...state.style, featureStyle })}
                        />
                        <VectorStyleJson type='optionalStyles'
                            style={ state.style.optionalStyles }
                            onChange={ (optionalStyles) => updateStyle({ ...state.style, optionalStyles })}
                        />
                    </Fragment>
                }
                { state.modal === 'external' &&
                    <VectorStyleJson
                        type= {externalType}
                        style={ state.style }
                        onChange={ (style) => updateStyle(style)}
                    />
                }
            </Modal>

            <VectorStyleSelect
                layer={ layer }
                controller={ controller }
                editStyle={ editStyle }
            />
        </FullWidthSpace>
    );
}));

VectorStyle.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    external: PropTypes.bool.isRequired
};
