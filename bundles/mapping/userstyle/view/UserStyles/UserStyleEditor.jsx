import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput, Tooltip, Divider } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { BUNDLE_KEY } from '../../constants';

export const UserStyleEditor = ({ style, geometryType, onAdd, onCancel }) => {
    const { style: { featureStyle = {} } = {}, name } = style;
    const defaultStyle = Oskari.custom.generateBlankStyle();
    const [state, setState] = useState({
        featureStyle: Object.keys(featureStyle).length > 0 ? featureStyle : defaultStyle,
        name
    });

    const updateStyle = featureStyle => setState({ ...state, featureStyle });
    const updateName = name => setState({ ...state, name });

    return (
        <div>
            <Tooltip title={<Message messageKey='popup.name'/>}>
                <TextInput
                    placeholder={ Oskari.getMsg(BUNDLE_KEY, `popup.name`) }
                    value={ state.name }
                    onChange={ event => updateName(event.target.value) }
                />
            </Tooltip>
            <Divider orientation="left">
                <Message messageKey='popup.style'/>
            </Divider>
            <StyleEditor
                oskariStyle={ state.featureStyle }
                geometryType={ geometryType }
                onChange={ updateStyle }
            />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onCancel}/>
                <PrimaryButton type='save' onClick={() => onAdd(state)}/>
            </ButtonContainer>
        </div>
    );
};

UserStyleEditor.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    geometryType: PropTypes.string
};
