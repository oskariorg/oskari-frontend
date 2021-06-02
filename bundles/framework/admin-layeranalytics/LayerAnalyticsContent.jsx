import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'oskari-ui';

export const LayerAnalyticsContent = ({ analyticsData }) => {
    console.log(analyticsData);
    console.log(analyticsData.errorsTop);
    return (
        <List
            bordered
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            dataSource={ analyticsData.errorsTop }
            renderItem={ (item) => (
                <ListItem>
                    { item.success } { item.id }
                </ListItem>
            )}
        />
    );
};

LayerAnalyticsContent.propTypes = {
    analyticsData: PropTypes.array
};
