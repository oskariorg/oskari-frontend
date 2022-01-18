import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Divider, Modal, LocalizationComponent, TextInput } from 'oskari-ui';
import { createLocalizedLabels } from 'oskari-ui/components/LocalizationComponent';

import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { LOCALE_KEY } from './constants';

const PaddedInput = styled(TextInput)`
    margin-bottom: 10px;
`;

const getPlaceholders = () => {
    const localizedFields = { name: Oskari.getMsg(LOCALE_KEY, 'categoryform.layerName') };
    return createLocalizedLabels(localizedFields);
};

const getMandatory = (defaultLang) => {
    const mandatory = {};
    mandatory[defaultLang] = ['name'];
    return mandatory;
};

export const MyPlacesLayerForm = ({ locale: initLocale, style: initStyle, onSave, onCancel }) => {
    const [editorState, setEditorState] = useState({
        style: initStyle || OSKARI_BLANK_STYLE,
        locale: initLocale || {}
    });
    const { locale, style } = editorState;
    const updateStyle = (style) => setEditorState({ ...editorState, style });
    const updateLocale = (locale) => setEditorState({ ...editorState, locale });
    const defaultLang = Oskari.getDefaultLanguage();
    const hasName = Oskari.util.keyExists(locale, `${defaultLang}.name`) && locale[defaultLang].name.trim().length > 0;
    // TODO: show warning in button tooltip
    // { !hasName && <Message messageKey='validation.categoryName' /> }
    return (
        <Modal
            title={ <Message messageKey={ 'categoryform.title' } /> }
            visible={ true }
            onOk={ () => onSave(locale, style) }
            maskClosable = { false }
            okButtonProps={ { disabled: !hasName } }
            onCancel={ onCancel }
            cancelText={ <Message messageKey="buttons.cancel" /> }
            okText={ <Message messageKey="buttons.save" /> }
        >
            <LocalizationComponent
                placeholders={ getPlaceholders() }
                value={ locale }
                languages={ Oskari.getSupportedLanguages() }
                onChange={ updateLocale }
                mandatoryFields = { getMandatory(defaultLang) }
            >
                <PaddedInput type='text' name='name' />
            </LocalizationComponent>
            <Divider orientation="left"><Message messageKey={ 'categoryform.styleTitle' } /></Divider>
            <StyleEditor
                oskariStyle={ style }
                onChange={ updateStyle }
            />
        </Modal>
    );
};

MyPlacesLayerForm.propTypes = {
    locale: PropTypes.object,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
