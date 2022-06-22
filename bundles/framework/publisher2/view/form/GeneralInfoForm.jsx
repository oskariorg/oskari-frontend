import React, { useState } from 'react';
import { LabeledInput, Select, Option, Message, Label } from 'oskari-ui';
import styled from 'styled-components';
import { InfoIcon } from 'oskari-ui/components/icons';

const FieldWithInfo = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const BUNDLE_KEY = 'Publisher2';

export const GeneralInfoForm = ({ languageChange, onChange, data }) => {

    const [name, setName] = useState(data.name.value ? data.name.value : null);
    const [domain, setDomain] = useState(data.domain.value ? data.domain.value : null);
    const [language, setLanguage] = useState( data.language.value ? data.language.value : Oskari.getLang());

    const languages = Oskari.getSupportedLanguages();

    return (
        <div>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.name.label' bundleKey={BUNDLE_KEY} />}
                    name='name'
                    value={name}
                    mandatory={true}
                    onChange={(e) => {
                        setName(e.target.value)
                        onChange(e)
                    }}
                />
                <InfoIcon><Message messageKey='BasicView.name.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.domain.label' bundleKey={BUNDLE_KEY} />}
                    name='domain'
                    value={domain}
                    onChange={(e) => {
                        setDomain(e.target.value)
                        onChange(e)
                    }}
                />
                <InfoIcon><Message messageKey='BasicView.domain.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
            <Label>
                <Message messageKey='BasicView.language.label' bundleKey={BUNDLE_KEY} />
            </Label>
            <FieldWithInfo>
                <Select
                    name='language'
                    value={language}
                    onChange={(lang) => {
                        setLanguage(lang)
                        languageChange(lang)
                    }}
                >
                    {languages.map(lang => (
                        <Option value={lang} key={lang}>
                            <Message messageKey={`BasicView.language.options.${lang}`} bundleKey={BUNDLE_KEY} />
                        </Option>
                    ))}
                </Select>
                <InfoIcon><Message messageKey='BasicView.language.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
        </div>
    );
};
