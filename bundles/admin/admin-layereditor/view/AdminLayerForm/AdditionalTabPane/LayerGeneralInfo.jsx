import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const StyledRoot = styled('div')`
    padding-bottom: 20px;
`;

const dateLocale = 'fi-FI'; // we are not using here other locales than Finnish so we can hard core it into constant variable
const dateOptions = {
    time: {
        second: '2-digit'
    }
};

export const LayerGeneralInfo = ({ layer }) => {
    const created = Oskari.util.formatDate(layer.created, dateOptions, dateLocale);
    const updated = Oskari.util.formatDate(layer.updated, dateOptions, dateLocale);

    return (
        <StyledRoot>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.layerId' /></Col>
                <Col span={ 12 }>{ layer.id }</Col>
            </Row>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.created' /></Col>
                <Col span={ 12 }>{ created }</Col>
            </Row>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.updated' /></Col>
                <Col span={ 12 }>{ updated }</Col>
            </Row>
        </StyledRoot>
    );
};

LayerGeneralInfo.propTypes = {
    layer: PropTypes.object.isRequired
};
