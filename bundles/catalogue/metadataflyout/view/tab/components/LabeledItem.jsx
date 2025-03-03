import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Label, List, Paragraph } from '..';
import { Link } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';

const getContent = (item) => {
    if (typeof item !== 'object') {
        return item;
    }
    if (Array.isArray(item)) {
        return item.map((child, i) => <Fragment key={i}>{getContent(child)}</Fragment>);
    }
    const { label, description, url, name } = item;
    const descIcon = description ? <InfoIcon title={description} /> : null;
    if (url) {
        return <Link url={url} >{label || name || url}</Link>;
    }
    return <Fragment>{label || name}{descIcon}</Fragment>;
};

const getNodes = (content, renderList) => {
    if (renderList) {
        return (
            <List>
                {content.map((item, i) => <li key={i}>{getContent(item)}</li>)}
            </List>
        );
    }
    return content.map((item, i) => <Paragraph key={i}>{getContent(item)}</Paragraph>);
};

export const LabeledItem = ({ source, labelKey, dataKey, renderList }) => {
    const content = source[dataKey];
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
