import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Message, Option, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField, StyledLink, Border, DefaultStyle, StyleField, StyleSelect } from './styled';
import { SelectOutlined } from '@ant-design/icons';

const ServiceLegend = ({ url }) => {
    if (!url) {
        return (
            <Fragment>
                <Message messageKey='styles.raster.serviceLegend' />
                <span>:&nbsp;</span>
                <Message messageKey='styles.raster.serviceNotAvailable' />
            </Fragment>
        );
    }
    return (
        <Tooltip title={url}>
            <Message messageKey='styles.raster.serviceLegend' />
            <Link url={url}/>
        </Tooltip>
    );
};

ServiceLegend.propTypes = {
    url: PropTypes.string
};

const Link = ({ url }) => (
    <StyledLink href={url} rel="noreferrer noopener" target="_blank" >
        <SelectOutlined/>
    </StyledLink>
);
Link.propTypes = {
    url: PropTypes.string.isRequired
};

const LegendImage = LocaleConsumer(({ legendImage = '', controller, getMessage }) => (
    <Fragment>
        <Message messageKey='styles.raster.legendImage'/>
        <InfoTooltip messageKeys='styles.raster.legendImageDesc'/>
        <StyledFormField>
            <TextInput
                placeholder={getMessage('styles.raster.legendImagePlaceholder')}
                value={legendImage}
                onChange={(evt) => controller.setLegendImage(evt.target.value)} />
        </StyledFormField>
    </Fragment>
));
LegendImage.propTypes = {
    legendImage: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

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
                            { legendUrl && <Link url = {legendUrl} /> }
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
