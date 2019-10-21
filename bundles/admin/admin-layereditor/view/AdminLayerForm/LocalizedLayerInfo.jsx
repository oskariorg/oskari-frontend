import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'oskari-ui';
import { StyledComponent } from './StyledFormComponents';

const getLocalizedLabels = (lang, getMessage) => {
    let prefix = typeof getMessage(lang) === 'object' ? lang : 'generic';
    return {
        name: getMessage(`${prefix}.placeholder`, [lang]),
        description: getMessage(`${prefix}.descplaceholder`, [lang])
    };
};

export const LocalizedLayerInfo = ({ layer, lang, service, getMessage }) => {
    const selectedLang = Oskari.getLang();
    const name = layer[`name_${lang}`];
    const description = layer[`title_${lang}`];
    const labels = getLocalizedLabels(lang, getMessage);
    const onNameChange = evt => service.setLocalizedLayerName(lang, evt.target.value);
    const onDescriptionChange = evt => service.setLocalizedLayerDescription(lang, evt.target.value);
    const nameInput = <TextInput type='text' value={name} onChange={onNameChange} />;
    const descInput = <TextInput type='text' value={description} onChange={onDescriptionChange} />;
    if (selectedLang === lang) {
        return (
            <>
                <label>{labels.name}</label>
                <StyledComponent>
                    {nameInput}
                </StyledComponent>
                <label>{labels.description}</label>
                <StyledComponent>
                    {descInput}
                </StyledComponent>
            </>
        );
    }
    return (
        <React.Fragment>
            <div>{labels.name}{nameInput}</div>
            <div>{labels.description}{descInput}</div>
        </React.Fragment>
    );
};

LocalizedLayerInfo.propTypes = {
    lang: PropTypes.string.isRequired,
    service: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    getMessage: PropTypes.func.isRequired
};
