import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { ServiceLegend } from './ServiceLegend';
import { Link } from './Link';
import { StyledFormField, Border, InlineBlock } from './styled';
import { RasterStyleSelect } from './RasterStyle/RasterStyleSelect';

const GLOBAL_LEGEND = 'legendImage';

export const rasterStyleCapabilities = layer => {
    const { options = {}, capabilities = {}, style } = layer;
    const { styles = [] } = capabilities;
    const { legends = {} } = options;
    const selectedExists = styles.some(s => s.name === style);
    const warnings = [];
    if (style && !selectedExists) {
        warnings.push('defaultStyle');
    }
    const additionals = legendsWithoutStyle(styles, legends);
    const hasGlobal = additionals.find(name => name === GLOBAL_LEGEND);
    // don't notify if global is only additional legend
    if (additionals.length > 1 || (additionals.lenth === 1 && !hasGlobal)) {
        warnings.push('additionalLegend');
    }
    if (styles.length > 0 && hasGlobal) {
        warnings.push('globalWithStyles');
    }
    return warnings;
};

const legendsWithoutStyle = (styles, legends) => {
    const styleNames = styles.map(s => s.name);
    return Object.keys(legends)
        .filter(name => !styleNames.includes(name));
};

const additionalLegendsToStyles = (styles, legends, globalTitle) => {
    return legendsWithoutStyle(styles, legends)
        .map(name => {
            const style = {
                name,
                legend: legends[name]
            };
            const title = GLOBAL_LEGEND === name ? globalTitle : name;
            style.title = title + ' *';
            return style;
        });
};

const RasterStyle = ({ layer, controller, getMessage }) => {
    const { options = {}, capabilities = {}, style: defaultName } = layer;
    const { styles = [] } = capabilities;
    const { legends = {} } = options;
    const additionalLegends = additionalLegendsToStyles(styles, legends, getMessage('styles.raster.legendImage'));
    const styleOptions = [...styles, ...additionalLegends];

    const firstOption = styleOptions.length > 0 ? styleOptions[0].name : '';
    const [selected, setSelected] = useState(defaultName || firstOption);

    const style = styles.find(s => s.name === selected);
    const name = style ? style.name : GLOBAL_LEGEND;
    const styleLegend = style ? style.legend : '';
    // user/layer gets legend in following order: named override, global override, defined in service/capabilities/style
    const legendUrl = legends[name] || legends[GLOBAL_LEGEND] || '';

    return (
        <Fragment>
            <Message messageKey='styles.raster.title'/>
            <InfoTooltip messageKeys={['styles.raster.styleDesc', 'styles.desc']} />
            <Border>
                <Fragment>
                    <RasterStyleSelect
                        selected = {selected}
                        styles = {styleOptions}
                        defaultName = {defaultName}
                        setSelected = {setSelected}
                        controller = {controller}>
                    </RasterStyleSelect>
                    <StyledFormField>
                        <ServiceLegend url = {styleLegend} />
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
