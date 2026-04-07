import React, { useState, useEffect } from 'react';
import { Modal } from 'oskari-ui/components/Modal';
import { PropertiesLocale } from 'oskari-ui/components/VectorLayerPresentation';
import { Message } from 'oskari-ui';

// eslint-disable-next-line react/prop-types
export const LocaleModal = ({ propNames, selectedProperties, localeModalVisible, locale, updateLocale, closeModal }) => {

    const [draft, setDraft] = useState(structuredClone(locale));

    useEffect(() => {
        setDraft(structuredClone(locale));
    }, [locale]);

    const onModalOk = () => {
        // deep clone to not mess local state
        const value = structuredClone(draft);
        updateLocale(value);
        closeModal();
        setDraft(structuredClone(locale));
    };

    const onModalUpdate = (value) => {
        // update local draft
        const newValue = structuredClone(value);
        setDraft(newValue);
    };

    const onModalCancel = () => {
        setDraft(structuredClone(locale));
        closeModal();
    };

    return <Modal
        mask={ false }
        maskClosable= { false }
        open={ !!localeModalVisible }
        onOk={ onModalOk}
        onCancel={ onModalCancel }
        cancelText={ <Message messageKey="cancel" /> }
        okText={ <Message messageKey="save" /> }
        width={ 500 }
    >
        <PropertiesLocale update={onModalUpdate} locale={draft}
            properties={propNames} selected={selectedProperties}/>
    </Modal>;
};