import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { StyledComponent } from './StyledFormComponents';

export const LocalizedLayerInfo = LocaleConsumer(({ layer, lang, service, getMessage }) => {
    const selectedLang = Oskari.getLang();
    const name = layer[`name_${lang}`];
    const description = layer[`title_${lang}`];
    const langPrefix = typeof getMessage(lang) === 'object' ? lang : 'generic';
    const onNameChange = evt => service.setLocalizedLayerName(lang, evt.target.value);
    const onDescriptionChange = evt => service.setLocalizedLayerDescription(lang, evt.target.value);
    if (selectedLang === lang) {
        return (
            <React.Fragment>
                <Message messageKey={`${langPrefix}.placeholder`} messageArgs={[lang]} />
                <StyledComponent>
                    <TextInput type='text' value={name} onChange={onNameChange} />
                </StyledComponent>
                <Message messageKey={`${langPrefix}.descplaceholder`} messageArgs={[lang]} />
                <StyledComponent>
                    <TextInput type='text' value={description} onChange={onDescriptionChange} />
                </StyledComponent>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <Message messageKey={`${langPrefix}.placeholder`} messageArgs={[lang]} />
            <TextInput type='text' value={name} onChange={onNameChange} />
            <Message messageKey={`${langPrefix}.descplaceholder`} messageArgs={[lang]} />
            <TextInput type='text' value={description} onChange={onDescriptionChange} />
        </React.Fragment>
    );
});

LocalizedLayerInfo.propTypes = {
    lang: PropTypes.string.isRequired,
    service: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired
};
