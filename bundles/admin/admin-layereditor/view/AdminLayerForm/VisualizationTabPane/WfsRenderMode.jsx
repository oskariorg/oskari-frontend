import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Radio } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { RENDER_MODE_MVT, RENDER_MODE_VECTOR } from '../../../../../mapping/mapmodule/domain/constants';

export const WfsRenderMode = ({ layer, controller }) => {
    const options = layer.options || {};
    const value = options.renderMode || RENDER_MODE_VECTOR;
    return (
        <Fragment>
            <Message messageKey='renderMode.title'/>
            <StyledFormField>
                <Radio.Group value={value} buttonStyle='solid' onChange={evt => controller.setRenderMode(evt.target.value)}>
                    <Radio.Button value={RENDER_MODE_VECTOR}>
                        <Message messageKey='renderMode.geojson'/>
                    </Radio.Button>
                    <Radio.Button value={RENDER_MODE_MVT}>
                        <Message messageKey='renderMode.mvt'/>
                        <InfoIcon title={<Message messageKey='renderMode.info'/>} />
                    </Radio.Button>
                </Radio.Group>
            </StyledFormField>
        </Fragment>
    );
};
WfsRenderMode.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
