import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Slider } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';
import styled from 'styled-components';

const VerticalComponent = styled(StyledFormField)`
    height: 400px;
    padding-bottom: 20px;
    margin-left: 25%;
`;

export const Scale = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='minAndMaxScale'/>
        <VerticalComponent>
            <Slider key={layer.id}
                vertical
                range
                defaultValue={[layer.minscale, layer.maxscale]}
                min={0}
                max={100000000}
                onChange={values => controller.setMinAndMaxScale(values)} />
        </VerticalComponent>
    </Fragment>
);
Scale.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
