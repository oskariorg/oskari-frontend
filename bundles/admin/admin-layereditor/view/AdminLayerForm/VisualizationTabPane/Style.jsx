import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledComponent } from '../StyledFormComponents';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const Style = ({ layer, propertyFields, controller }) => {
    const styleInfoKeys = propertyFields.includes(LayerComposingModel.CAPABILITIES_STYLE)
        ? ['styleDesc', 'styleDescCapabilities'] : 'styleDesc';
    return (
        <Fragment>
            <Message messageKey='style'/>
            <InfoTooltip messageKeys={styleInfoKeys} />
            <StyledComponent>
                <Select
                    defaultValue={layer.style}
                    onChange={value => controller.setStyle(value)}>
                    { layer.styles.map(style =>
                        <Option key={style.name} value={style.name}>{style.title}</Option>
                    )}
                </Select>
            </StyledComponent>
        </Fragment>
    );
};
Style.propTypes = {
    layer: PropTypes.string,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
