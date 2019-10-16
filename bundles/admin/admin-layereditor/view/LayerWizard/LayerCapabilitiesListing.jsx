import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Popover } from 'oskari-ui';

export const LayerCapabilitiesListing = (props) => {
    return (<List dataSource={props.capabilities} rowKey="name" renderItem={item => getItem(props.onSelect, item)}></List>);
};

const getItem = (onSelect, item) => {
    return (
        <Popover content={generateContent(item)} title={item.name} placement="right">
            <ListItem onClick={() => onSelect(item)}>
                {item.name}
            </ListItem>
        </Popover>
    );
};

const generateContent = (item) => {
    return <pre>{JSON.stringify(item.locale, null, 2)}</pre>;
};

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func
};
