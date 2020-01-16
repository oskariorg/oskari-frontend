import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Radio } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { InfoTooltip } from '../InfoTooltip';

const VECTOR = 'geojson';
const MVT = 'mvt';

export const WfsRenderMode = ({ layer, controller }) => {
    const options = layer.options || {};
    const value = options.renderMode || VECTOR;
    return (
        <Fragment>
            <Message messageKey='renderMode.title'/>
            <StyledComponent>
                <Radio.Group value={value} buttonStyle='solid' onChange={evt => controller.setRenderMode(evt.target.value)}>
                    <Radio.Button value={VECTOR}>
                        <Message messageKey='renderMode.geojson'/>
                    </Radio.Button>
                    <Radio.Button value={MVT}>
                        <Message messageKey='renderMode.mvt'/>
                        <InfoTooltip messageKeys='renderMode.info'/>
                    </Radio.Button>
                </Radio.Group>
            </StyledComponent>
        </Fragment>
    );
};
WfsRenderMode.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
