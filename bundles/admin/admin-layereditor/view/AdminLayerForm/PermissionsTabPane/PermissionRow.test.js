import React from 'react';
import { screen, render } from '@testing-library/react';
import { PermissionRow } from './PermissionRow';
import { Checkbox } from 'oskari-ui';

describe('<PermissionRow/>', () => {
    test('renders one div with containing param text and as many checkboxes as passed as parameter', () => {
        expect.assertions(2);
        const mockText = 'Mock rolename text';
        const mockCheckboxes = [<Checkbox data-testid={mockText} key={'key1'} onChange={() => console.log('Not called in this test')}/>,
            <Checkbox data-testid={mockText} key={'key2'} onChange={() => console.log('Not called in this test')}/>];
        const row = render(<PermissionRow text={mockText} checkboxes={mockCheckboxes}
            isHeaderRow={false}/>);

        expect(screen.queryAllByText(mockText)).toHaveLength(1);
        expect(row.queryAllByRole('checkbox')).toHaveLength(mockCheckboxes.length);
    });
});
