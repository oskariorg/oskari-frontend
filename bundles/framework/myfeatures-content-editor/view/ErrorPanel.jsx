import React from 'react';
import PropTypes from 'prop-types';
import { Message, Spin } from 'oskari-ui';

export const ErrorPanel = ({ loading = false }) => {
    if (loading) {
        return (<Spin><Message messageKey="ContentEditorView.info.loading"/></Spin>);
    }
    return (<Message messageKey="ContentEditorView.info.problem"/>);
};

ErrorPanel.propTypes = {
    loading: PropTypes.bool
};
