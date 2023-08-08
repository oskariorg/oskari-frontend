import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Spin, LabeledInput, Message, Checkbox } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton, DeleteButton } from 'oskari-ui/components/buttons';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { LocaleProvider, LocaleConsumer, handleBinder, Controller } from 'oskari-ui/util';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled('div')`
    min-width: 300px;
    margin: 12px 24px 24px;
`;
const Header = styled('div')`
    font-weight: bold;
`;

const DeleteLayersCheckbox = styled(Checkbox)`
    padding-top: 15px;
`;

const hasMandatoryValues = (current, defaultLang) => {
    if (!current) {
        return false;
    }
    const langValue = current[defaultLang] || {};
    const curName = langValue.name || '';
    return curName.trim().length > 0;
};
const LocalizedContent = LocaleConsumer(({ loading, value, headerMessageKey, controller, isNew, deleteMapLayersText, layerCountInGroup, deleteLayers, hasSubgroups, getMessage, options, confirmOpen, onClose }) => {
    const RemoveGroupButton = () => {
        if (isNew) {
            // we are adding a group so we don't want to show Delete button
            return null;
        }
        // FIXME: setDeleteLayer closes confirm. set visible to components state??
        const title = (
            <React.Fragment>
                <div>
                    <Message messageKey='messages.confirmDeleteGroup' />
                </div>
                {layerCountInGroup > 0 &&
                    <DeleteLayersCheckbox checked={deleteLayers} onChange={evt => controller.setDeleteLayers(evt.target.checked)}>
                        {deleteMapLayersText + ' (' + layerCountInGroup + ')'}
                    </DeleteLayersCheckbox>}
            </React.Fragment>
        );
        const tooltip = hasSubgroups ? <Message messageKey='messages.deleteErrorGroupHasSubgroups' /> : null;
        return (
            <DeleteButton
                type='label'
                disabled={hasSubgroups}
                title={title}
                tooltip={tooltip}
                open={confirmOpen}
                onConfirm={() => {
                    controller.setConfirmOpen(false);
                    controller.delete(options?.id);
                }}
                onClick={() => controller.setConfirmOpen(true)}
                onCancel={() => controller.setConfirmOpen(false)}
            />
        );
    };
    const languages = Oskari.getSupportedLanguages();
    const isValid = hasMandatoryValues(value, languages[0]);
    const Component = (
        <Container>
            <Header>
                <Message messageKey={headerMessageKey} />
            </Header>
            <LocalizationComponent
                value={value}
                languages={languages}
                onChange={controller.setValue}
            >
                <LabeledInput type="text" name="name" label={getMessage(`fields.locale.name`)} mandatory={true}/>
                <LabeledInput type="textarea" name="desc" label={getMessage(`fields.locale.description`)} />
            </LocalizationComponent>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onClose()} />
                <RemoveGroupButton />
                <PrimaryButton type='save' onClick={() => controller.save(options?.id, options?.parentId)} disabled={!isValid} />
            </ButtonContainer>
        </Container>
    );
    if (loading) {
        return <Spin>{Component}</Spin>;
    }
    return Component;
});

export const showGroupingPopup = (title, options = {}, deleteMapLayersText, controller, state, onClose) => {

    const Content = <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
            <LocalizedContent {...state}
                controller={controller}
                isNew={!options.id}
                deleteMapLayersText={deleteMapLayersText}
                layerCountInGroup={options.layerCountInGroup}
                hasSubgroups={options.hasSubgroups}
                options={options}
                onClose={onClose}
                confirmOpen={state.confirmOpen}/>
        </LocaleProvider>;
    const popupControls = showPopup(title, Content, onClose);

    return {
        ...popupControls,
        update: (state) => (
            popupControls.update(
                title,
                <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
                    <LocalizedContent {...state}
                        controller={controller}
                        isNew={!options.id}
                        deleteMapLayersText={deleteMapLayersText}
                        layerCountInGroup={options.layerCountInGroup}
                        hasSubgroups={options.hasSubgroups}
                        options={options}
                        onClose={onClose}
                        confirmOpen={state.confirmOpen}/>
                </LocaleProvider>
            )
        )
    };
};
