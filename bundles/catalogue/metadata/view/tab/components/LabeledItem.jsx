import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from '..';
import { Link } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';

const List = styled.ul`
    margin-left: 20px;
    margin-bottom: 18px;
`;

const Item = styled.p`
    margin-bottom: 18px;
`;

const getContent = (item, key, Node) => {
    if (typeof item !== 'object') {
        return item;
    }
    const { label, description, url, items, name } = item;
    const desc = description ? <InfoIcon title={description} /> : null;
    if (url) {
        return <Link key={key} url={url} >{label || name}</Link>;
    }
    if (items) {
        return (
            <Fragment>
                {label || name}{desc}
                <List>
                    {items.map((item, i) => <li key={i}>{item}{desc}</li>)}
                </List>
            </Fragment>
        );
    }
    return <Fragment key={key}>{label || name}{desc}</Fragment>;
};

const getNodes = (content, renderList) => {
    if (renderList) {
        return (
            <List>
                {content.map((item, i) => <li key={i}>{getContent(item)}</li>)}
            </List>
        );
    }
    return content.map((item, i) => <Item key={i}>{getContent(item)}</Item>);
};

export const LabeledItem = ({ source, labelKey, dataKey, renderList }) => {
    const content = source[dataKey];
    !content && console.log(dataKey, source);
    if (!content) {
        return null;
    }
    const array = Array.isArray(content) ? content : [content];
    if (!array.length) {
        return null;
    }
    return (
        <Fragment>
            <Label labelKey={labelKey || dataKey} />
            { getNodes(array, renderList) }
        </Fragment>
    );
};

LabeledItem.propTypes = {
    source: PropTypes.object.isRequired,
    dataKey: PropTypes.string.isRequired,
    labelKey: PropTypes.string,
    renderList: PropTypes.bool
};
