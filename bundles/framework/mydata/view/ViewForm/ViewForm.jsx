import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { showPopup } from 'oskari-ui/components/window';
import { ViewFormContent } from './ViewFormContent';

export const BUNDLE_NAME = 'MyData';

export const showViewForm = (view, onOk, onClose) => {
    const { id, ...values } = view || {};
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <ViewFormContent values={values} onOk={onOk} onCancel={onClose}/>
        </LocaleProvider>
    );
    const titleKey = id ? 'edit' : 'save';
    const title = <Message messageKey={`tabs.myviews.popup.title.${titleKey}`} bundleKey={BUNDLE_NAME} />;
    const controls = showPopup(title, content, onClose);
    return {
        id,
        ...controls
    };
};

showViewForm.propTypes = {
    view: PropTypes.object, // contains values for name, description & isDefault
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
