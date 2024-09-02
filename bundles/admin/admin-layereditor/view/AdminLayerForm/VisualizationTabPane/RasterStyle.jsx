import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput, Link } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoIcon } from 'oskari-ui/components/icons';
import { StyledFormField, Border } from './styled';
import { RasterStyleSelect } from './RasterStyle/RasterStyleSelect';
import { ServiceLegend } from './RasterStyle/ServiceLegend';
import { legendsWithoutStyle, GLOBAL_LEGEND } from './RasterStyle/helper';

const additionalLegendsToStyles = (styles, legends, globalTitle) => {
    return legendsWithoutStyle(styles, legends)
        .map(name => {
            const style = {
                name,
                legend: legends[name]
            };
            const title = GLOBAL_LEGEND === name ? globalTitle : name;
            style.title = title + ' ( ! )';
            return style;
        });
};

const RasterStyle = ({ layer, controller, getMessage }) => {
    const { options = {}, capabilities = {}, style: defaultName } = layer;
    const { styles = [] } = capabilities;
    const { legends = {} } = options; // overriding legend urls

    // Used to generate style-objects for styles that have been removed from the service
    // so we can show the override legends urls that we have saved for the layer
    // and notify admin that such styles don't exist any more on the service
    const additionalLegends = additionalLegendsToStyles(styles, legends, getMessage('styles.raster.legendImage'));
    const styleOptions = [...styles, ...additionalLegends];
    const firstOption = styleOptions.length > 0 ? styleOptions[0].name : '';
    const [selected, setSelected] = useState(defaultName || firstOption);

    // user/layer gets legend in following order: named override, global override, defined in service/capabilities/style
    const { name: nameForLegendUrl = GLOBAL_LEGEND } = styleOptions.find(s => s.name === selected) || {};
    const { legend: serviceLegendUrl = '' } = styles.find(s => s.name === selected) || {};
    const legendUrl = legends[nameForLegendUrl] || '';

    return (
        <Fragment>
            <Message messageKey='styles.raster.title'/>
            <InfoIcon>
                <Message messageKey='styles.raster.styleDesc'/>
                <Message messageKey='styles.desc'/>
            </InfoIcon>
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
                        <ServiceLegend url = {serviceLegendUrl} />
                    </StyledFormField>
                    <StyledFormField>
                        <Fragment>
                            <Message messageKey='styles.raster.overriddenLegend' />
                            <InfoIcon title={<Message messageKey='styles.raster.overrideTooltip'/>} />
                            { legendUrl && <Link url = {legendUrl} /> }
                            <TextInput
                                value = {legendUrl}
                                onChange={evt => controller.setLegendUrl(nameForLegendUrl, evt.target.value)}
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
