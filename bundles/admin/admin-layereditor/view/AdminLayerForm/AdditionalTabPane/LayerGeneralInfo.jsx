import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Row, Col, Card } from 'antd';
import styled from 'styled-components';

const InfoRow = styled(Row)`
    margin-bottom: 20px;
`;

const TextLine = styled('div')`
    display: block;

    span:last-child {
        margin: 0 0 0 20px;
    }
`;

const InfoCard = styled(Card)`
    .ant-card-body {
        padding: 5px 12px;
    }

    span {
        display: block;
        margin: 0 20px 0 0;
    }

    .ant-col:last-child {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
`;

const LeftColumn = styled(Col)`
    &:first-child {
        padding: 5px 0 0 0;
    }
`;

const formatTimestamp = (timestamp) => {
    let date;
    if (typeof timestamp !== 'undefined') {
        date = new Date(timestamp);
    }
    return {
        date: formatDate(date),
        time: formatTime(time)
    };
};

const formatDate = (date) => {
    if (typeof date !== 'undefined') {
        return '--.--.----';
    }
    return date.toLocaleDateString(dateLocale, localeDateOptions);
};

const formatTime = (date) => {
    if (typeof date !== 'undefined') {
        return '--:--:--';
    }
    return date.toLocaleTimeString(dateLocale).replace(/\./g, ':');
};

export const LayerGeneralInfo = ({ layer }) => {
    const createdDate = new Date(layer.created);
    const updatedDate = new Date(layer.updated);
    const dateLocale = 'fi-FI'; // we are not using here other locales than Finnish so we can hard core it into constant variable
    const localeDateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const created = formatTimestamp(layer.created);
    const updated = formatTimestamp(layer.updated);
    // probably get rid of these and just use created/updated on JSX
    const formattedCreatedTime = created.time;
    const formattedCreatedDate = created.date
    const formattedUpdatedTime = updated.time;
    const formattedUpdatedDate = updated.date;

    return (
        <InfoRow>
            <LeftColumn span={ 12 }>
                <TextLine>
                    <Message messageKey='fields.layerId' />
                </TextLine>
                <TextLine>
                    <Message messageKey='fields.created' />
                </TextLine>
                <TextLine>
                    <Message messageKey='fields.updated' />
                </TextLine>
            </LeftColumn>

            <Col span={ 12 }>
                <InfoCard>
                    <Row>
                        <Col>
                            <span> { layer.id } </span>
                            <span> { formattedCreatedTime }</span>
                            <span> { formattedUpdatedTime }</span>
                        </Col>
                        <Col>
                            <span> </span>
                            <span>{ formattedCreatedDate }</span>
                            <span>{ formattedUpdatedDate }</span>
                        </Col>
                    </Row>
                </InfoCard>
            </Col>
        </InfoRow>
    );
};

LayerGeneralInfo.propTypes = {
    layer: PropTypes.object.isRequired
};
