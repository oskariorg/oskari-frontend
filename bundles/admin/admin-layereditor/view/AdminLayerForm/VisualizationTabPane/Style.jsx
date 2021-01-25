import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField } from './styled';

const {
    CAPABILITIES_STYLES,
    STYLES_JSON,
    EXTERNAL_STYLES_JSON
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const Style = ({ layer, propertyFields, controller }) => {
    const styleInfoKeys = ['styleDesc'];
    let styleOptions = [];

    if (propertyFields.includes(CAPABILITIES_STYLES)) {
        styleInfoKeys.push('capabilities.styleDesc');
        if (Oskari.util.keyExists(layer, 'capabilities.styles')) {
            styleOptions = layer.capabilities.styles;
        }
    } else {
        if (propertyFields.includes(STYLES_JSON) && layer.options.styles) {
            styleOptions = Object.keys(layer.options.styles);
        }
        if (propertyFields.includes(EXTERNAL_STYLES_JSON) && layer.options.externalStyles) {
            styleOptions = styleOptions.concat(Object.keys(layer.options.externalStyles));
        }
    }
    if (!styleOptions || styleOptions.length === 0) {
        return null;
    }
    // Remove duplicates
    styleOptions = [...new Set(styleOptions)];
    return (
        <Fragment>
            <Message messageKey='fields.style'/>
            <InfoTooltip messageKeys={styleInfoKeys} />
            <StyledFormField>
                <Select
                    defaultValue={layer.style}
                    onChange={value => controller.setStyle(value)}
                >
                    { styleOptions.map(option => (
                        <Option key={option.name || option} value={option.name || option}>
                            {option.title || option.name || option}
                        </Option>
                    )) }
                </Select>
            </StyledFormField>
        </Fragment>
    );
};
Style.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
