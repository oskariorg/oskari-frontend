import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Row, Col } from 'antd';
import styled from 'styled-components';


const StyledRoot = styled('div')`
    padding-bottom: 20px;
`;

const dateLocale = 'fi-FI'; // we are not using here other locales than Finnish so we can hard core it into constant variable
const localeDateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
};

const formatTimestamp = (timestamp) => {
    let date;
    if (typeof timestamp !== 'undefined') {
        date = new Date(timestamp);
    }
    return {
        date: formatDate(date),
        time: formatTime(date)
    };
};

const formatDate = (date) => {
    if (typeof date === 'undefined') {
        return '--.--.----';
    }
    return date.toLocaleDateString(dateLocale, localeDateOptions);
};

const formatTime = (date) => {
    if (typeof date === 'undefined') {
        return '--:--:--';
    }
    return date.toLocaleTimeString(dateLocale).replace(/\./g, ':');
};

export const LayerGeneralInfo = ({ layer }) => {
    const created = formatTimestamp(layer.created);
    const updated = formatTimestamp(layer.updated);

    return (
        <StyledRoot>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.layerId' /></Col>
                <Col span={ 12 }>{ layer.id }</Col>
            </Row>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.created' /></Col>
                <Col span={ 12 }>{ created.date } { created.time }</Col>
            </Row>
            <Row>
                <Col span={ 12 }><Message messageKey='fields.updated' /></Col>
                <Col span={ 12 }>{ updated.date } { updated.time }</Col>
            </Row>
        </StyledRoot>
    );
};

LayerGeneralInfo.propTypes = {
    layer: PropTypes.object.isRequired
};
