import React, { useState, useEffect } from 'react';
import { Modal } from 'oskari-ui/components/Modal';
import { PropertiesLocale, PropertiesFormat } from 'oskari-ui/components/VectorLayerPresentation';
import { Message } from 'oskari-ui';
import { MODAL_FORMAT, MODAL_LOCALE } from './LayerFieldsTab';
import { LocaleProvider } from 'oskari-ui/util';

// eslint-disable-next-line react/prop-types
export const ModalContainer = ({ propNames, selectedProperties, modalOpen, locale, format, updateAttributes, closeModal }) => {

    const propLabels = Oskari.getLocalized(locale) || {};
    const [draft, setDraft] = useState({ locale, format });
    const [baseline, setBaseline] = useState(structuredClone({ locale, format }));

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(prev => {
            if (JSON.stringify(prev.locale) === JSON.stringify(locale) &&
                JSON.stringify(prev.format) === JSON.stringify(format)) {
                return prev;
            }

            const newState = {
                ...prev,
                locale: structuredClone(locale) || {},
                format: structuredClone(format) || {}
            };

            setBaseline(structuredClone(newState));

            return newState;
        });
    }, [locale, format]);

    const onModalOk = () => {
        // deep clone to not mess local state
        const value = structuredClone(draft[modalOpen]);
        updateAttributes(modalOpen, value);
        closeModal();
    };

    const onModalUpdate = (value) => {
        const newState = structuredClone(draft);
        delete newState[modalOpen];
        if (value) {
            newState[modalOpen] = structuredClone(value);
        }

        // update local draft
        setDraft(newState);
    };

    const onModalCancel = () => {
        setDraft(structuredClone(baseline));
        closeModal();
    };

    return <>
        <Modal
            mask={ false }
            maskClosable= { false }
            open={ !!modalOpen }
            onOk={ onModalOk}
            onCancel={ onModalCancel }
            cancelText={ <Message messageKey="cancel" /> }
            okText={ <Message messageKey="save" /> }
            width={ 500 }
        >
            { modalOpen === MODAL_LOCALE &&
                <PropertiesLocale update={onModalUpdate} locale={draft.locale}
                    properties={propNames} selected={selectedProperties}/>
            }
            { modalOpen === MODAL_FORMAT &&
                <PropertiesFormat update={onModalUpdate} properties={propNames}
                    format={draft.format} labels={propLabels} selected={selectedProperties}/>
            }
        </Modal>
    </>;
};