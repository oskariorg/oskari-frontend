import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { showPopup } from 'oskari-ui/components/window';
import { ViewFormContent } from './ViewFormContent';


export const showViewForm = (values, onOk, onClose) => {
    const BUNDLE_NAME = 'PersonalData';
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <ViewFormContent values={values} onOk={onOk} onCancel={onClose}/>
        </LocaleProvider>
    );
    const title = <Message messageKey="tabs.myviews.popup.title" bundleKey={BUNDLE_NAME} />;
    const controls = showPopup(title, content, onClose);
    return {
        ...controls,
        update: error => {
            controls.update(title,
                (<LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
                    <ViewFormContent values={values} onOk={onOk} onCancel={onClose} error={error}/>
                </LocaleProvider>));
        }
    };
};

showViewForm.propTypes = {
    values: PropTypes.object, // contains values for name, description & isDefault
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
