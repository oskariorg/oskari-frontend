import React from 'react';
import { mount } from 'enzyme';
import { PermissionRow } from './PermissionRow';
import { Checkbox } from 'oskari-ui';

describe('<PermissionRow/>', () => {
    test('renders one div with containing param text and as many checkboxes as passed as paremeter', () => {
        expect.assertions(2);
        const mockText = 'Mock rolename text';
        const mockCheckboxes = [<Checkbox key={'key1'} onChange={() => console.log('Not called in this test')}/>,
            <Checkbox key={'key2'} onChange={() => console.log('Not called in this test')}/>];
        const wrapper = mount(<PermissionRow text={mockText} checkboxes={mockCheckboxes}
            isHeaderRow={false}/>);
        expect(wrapper.find('div[children="' + mockText + '"]').length).toEqual(1);
        expect(wrapper.find(Checkbox).length).toEqual(mockCheckboxes.length);
    });
});
