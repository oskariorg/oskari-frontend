import React from 'react';
import { storiesOf } from '@storybook/react';
import { GenericForm } from './GenericForm';

const defaultRules = [
    {
        required: true,
        message: 'Empty field'
    }
];

const testRules = [
    {
      required: true,
      message: 'Please fill in this area',
    },
    () => ({
        validator: (_, value) => value 
        ? Promise.resolve(value).then(value => console.log('Validated:', value))
        : Promise.reject('Must validate')
    }),
];

const defaultProps = {
    formSettings: {
        label: 'Form settings label',
        showLabels: false,
        onFinish: () => {
            console.log('onFinish');
        },
        onFinishFailed: () => {
            console.log('onFinishFailed');
        }
    },
    fields: [
        {
            type: 'text',
            label: 'Name name',
            name: 'name',
            placeholder: 'Name placeholder',
            rules: testRules
        },
        {
            type: 'textarea',
            label: 'Textarea label',
            placeholder: 'Textarea placeholder',
            name: 'textarea_test',
            rules: defaultRules
        },
        {
            type: 'info',
            label: 'Info label',
            value: 'Info area isnt modifiable',
            name: 'info_test'
        },
        {
            type: 'dropdown',
            label: 'Dropdown label',
            placeholder: 'Dropdown placeholder',
            value: [
                'First',
                'Second',
                'Third'
            ],
            name: 'dropdown_test',
            rules: defaultRules
        },
        {
            type: 'submit',
            label: 'Submit label',
            value: 'submit',
            name: 'submit-button'
        }
    ]
};

storiesOf('GenericForm', module)
    .add('All fields', () => (
        <GenericForm props={{ ...defaultProps }} />
    ));
