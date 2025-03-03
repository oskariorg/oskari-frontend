import React from 'react';
import PropTypes from 'prop-types';
import { LabeledItem, DataQualities, Content } from '.';

export const QualityTabPane = ({ metadata }) => {
    return (
        <Content>
            <LabeledItem dataKey='lineageStatements' source={metadata} />
            <DataQualities content={metadata.dataQualities} detailed/>
        </Content>
    );
};

QualityTabPane.propTypes = {
    metadata: PropTypes.object.isRequired
};
