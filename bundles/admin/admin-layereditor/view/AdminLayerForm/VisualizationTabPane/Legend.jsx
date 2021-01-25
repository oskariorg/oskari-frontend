import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField, LegendLink, Border } from './styled';

const ServiceLegend = ({ url }) => {
    if (!url) {
        return (
            <Message messageKey='legend.serviceNotAvailable' />
        );
    }
    return (
        <LegendLink href={url} target="_blank" >{url}</LegendLink>
    );
};

ServiceLegend.propTypes = {
    url: PropTypes.string
};

const LegendImage = LocaleConsumer(({ legendImage = '', controller, getMessage }) => (
    <Fragment>
        <Message messageKey='legend.legendImage'/>
        <InfoTooltip messageKeys='legend.legendImageDesc'/>
        <StyledFormField>
            <TextInput
                placeholder={getMessage('legend.legendImagePlaceholder')}
                value={legendImage}
                onChange={(evt) => controller.setLegendImage(evt.target.value)} />
        </StyledFormField>
    </Fragment>
));
LegendImage.propTypes = {
    legendImage: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

export class Legend extends React.Component {
    constructor (props) {
        super(props);
        this.state = { selected: props.layer.style };
    }

    onStyleChange (selected) {
        this.setState({
            selected
        });
    }

    render () {
        const { layer, controller } = this.props;
        const { options = {}, capabilities = {}, legendImage } = layer;
        const styleOptions = capabilities.styles || [];
        const legends = options.legends || {};
        if (styleOptions.length === 0) {
            return (
                <LegendImage legendImage={legendImage} controller = {controller}/>
            );
        }
        const selectedStyle = this.state.selected;
        const style = styleOptions.find(s => s.name === selectedStyle) || styleOptions[0];
        const legendUrl = legends[selectedStyle] || legendImage || '';
        return (
            <Fragment>
                <Message messageKey='legend.title'/>
                <Border>
                    <Fragment>
                        <StyledFormField>
                            <Select
                                defaultValue={selectedStyle}
                                onChange={value => this.onStyleChange(value)}
                            >
                                { styleOptions.map(option => (
                                    <Option key={option.name} value={option.name}>
                                        {option.title || option.name}
                                    </Option>
                                )) }
                            </Select>
                        </StyledFormField>
                        <Fragment>
                            <StyledFormField>
                                <Message messageKey='legend.service' />
                            </StyledFormField>
                            <StyledFormField>
                                <ServiceLegend url = {style.legend} />
                            </StyledFormField>
                        </Fragment>
                        <StyledFormField>
                            <Fragment>
                                <Message messageKey='legend.overridden' />
                                <InfoTooltip messageKeys='legend.overrideTooltip' />
                                <TextInput
                                    value = {legendUrl}
                                    onChange={evt => controller.setLegendUrl(selectedStyle, evt.target.value)}
                                />
                            </Fragment>
                        </StyledFormField>
                    </Fragment>
                </Border>
            </Fragment>
        );
    }
};

Legend.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
