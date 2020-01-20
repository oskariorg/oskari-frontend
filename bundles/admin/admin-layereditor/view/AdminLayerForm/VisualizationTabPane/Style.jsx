import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledComponent } from '../StyledFormComponents';

const { CAPABILITIES_STYLE, STYLE_JSON } = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const getOptionsFromJson = json => {
    const options = ['default'];
    try {
        // Read json and remove duplicates
        const jsonKeys = Object.keys(JSON.parse(json));
        return Array.from(new Set([...options, ...jsonKeys]));
    } catch (err) {
        return null;
    }
};

export const Style = ({ layer, capabilities = {}, propertyFields, controller }) => {
    const styleInfoKeys = ['styleDesc'];
    let styleOptions;

    if (propertyFields.includes(CAPABILITIES_STYLE)) {
        styleInfoKeys.push('styleDescCapabilities');
        styleOptions = capabilities.styles;
    } else if (propertyFields.includes(STYLE_JSON)) {
        styleOptions = getOptionsFromJson(layer.styleJSON);
    }
    if (!styleOptions || styleOptions.length === 0) {
        return null;
    }
    return (
        <Fragment>
            <Message messageKey='style'/>
            <InfoTooltip messageKeys={styleInfoKeys} />
            <StyledComponent>
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
            </StyledComponent>
        </Fragment>
    );
};
Style.propTypes = {
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
