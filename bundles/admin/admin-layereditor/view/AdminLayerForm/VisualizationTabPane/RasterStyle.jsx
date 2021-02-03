import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Option, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { LegendImage } from './LegendImage';
import { ServiceLegend } from './ServiceLegend';
import { Link } from './Link';
import { StyledFormField, Border, DefaultStyle, StyleField, StyleSelect, InlineBlock } from './styled';

const RasterStyle = ({ layer, controller, getMessage }) => {
    const [selected, setSelected] = useState(layer.style);

    const isDefaultStyle = name => name === layer.style;
    const getStyleLabel = style => {
        const { name, title } = style;
        const label = title || name;
        if (isDefaultStyle(name)) {
            return label + ' (' + getMessage('styles.default') + ')';
        }
        return label;
    }
    const onDefaultStyleChange = (styleName, selected) => {
        const defaultStyle = selected ? styleName : '';
        controller.setStyle(defaultStyle);
    }

    const { options = {}, capabilities = {}, legendImage } = layer;
    const styleOptions = capabilities.styles || [];
    const legends = options.legends || {};
    if (styleOptions.length === 0) {
        return (
            <LegendImage legendImage={legendImage} controller = {controller}/>
        );
    }
    const style = styleOptions.find(s => s.name === selected) || styleOptions[0];
    const { name, legend } = style;
    const legendUrl = legends[name] || legendImage || '';
    return (
        <Fragment>
            <Message messageKey='styles.raster.title'/>
            <InfoTooltip messageKeys={['styles.raster.styleDesc', 'styles.desc']} />
            <Border>
                <Fragment>
                    <StyleField>
                        <StyleSelect
                            value={name}
                            onChange={setSelected}
                        >
                            { styleOptions.map(option => (
                                <Option key={option.name} value={option.name}>
                                    {getStyleLabel(option)}
                                </Option>
                            )) }
                        </StyleSelect>
                        <DefaultStyle
                            checked={isDefaultStyle(name)}
                            onClick={evt => onDefaultStyleChange(name, evt.target.checked)}
                        >
                            <Message messageKey='styles.default'/>
                        </DefaultStyle>
                    </StyleField>
                    <StyledFormField>
                        <ServiceLegend url = {legend} />
                    </StyledFormField>
                    <StyledFormField>
                        <Fragment>
                            <Message messageKey='styles.raster.overriddenLegend' />
                            <InfoTooltip messageKeys='styles.raster.overrideTooltip' />
                            { legendUrl &&
                                <InlineBlock>
                                    <Link url = {legendUrl} />
                                </InlineBlock>
                            }
                            <TextInput
                                value = {legendUrl}
                                onChange={evt => controller.setLegendUrl(name, evt.target.value)}
                                allowClear = {true}
                            />
                        </Fragment>
                    </StyledFormField>
                </Fragment>
            </Border>
        </Fragment>
    );
};

RasterStyle.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(RasterStyle);
export { contextWrap as RasterStyle };
