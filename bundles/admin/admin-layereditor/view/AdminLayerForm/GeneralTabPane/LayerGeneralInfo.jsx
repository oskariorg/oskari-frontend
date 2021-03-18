import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';

const InfoMargin = styled('div')`
    margin-top: 20px;
`;

const TextLine = styled('div')`
    display: block;
`;

const DateText = styled('span')`
    font-weight: bold;
`;

export const LayerGeneralInfo = ({ layer }) => {
    const createdDate = new Date(layer.created);
    const updatedDate = new Date(layer.updated);
    const dateLocale = Oskari.getLang();
    const localeDateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return (
        <Fragment>
            <TextLine>
                <Message messageKey='fields.layerId' />:
                <DateText> { layer.id } </DateText>
            </TextLine>
            { layer.created &&
                <TextLine>
                    <Message messageKey='fields.created' />:
                    <DateText> { createdDate.toLocaleTimeString(dateLocale) } { createdDate.toLocaleDateString(dateLocale, localeDateOptions) }</DateText>
                </TextLine>
            }
            { layer.updated &&
                <TextLine>
                    <Message messageKey='fields.updated' />:
                    <DateText> { updatedDate.toLocaleTimeString(dateLocale) } { updatedDate.toLocaleDateString(dateLocale, localeDateOptions) }</DateText>
                </TextLine>
            }
            <InfoMargin />
        </Fragment>
    );
};

LayerGeneralInfo.propTypes = {
    layer: PropTypes.object.isRequired
};
