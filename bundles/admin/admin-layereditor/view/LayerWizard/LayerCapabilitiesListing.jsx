import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'oskari-ui';

const getItem = (onSelect, item) => {
    return (
        <ListItem onClick={() => onSelect(item)}>
            {item.name}
        </ListItem>
    );
};

export const LayerCapabilitiesListing = (props) => {
    return (<List dataSource={props.capabilities} renderItem={item => getItem(props.onSelect, item)}></List>);
};

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func
};
