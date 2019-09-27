import React from 'react';
import { shallow } from 'enzyme';
import { LayerFilter } from './LayerFilter';

describe('<LayerFilter/> ', () => {
    const testText = 'someText';
    const testTooltip = 'someTooltip';
    const testFilterName = 'someFilterName';
    const testCurrentStyle = 'someStyle';

    test('uses props correctly', () => {
        expect.assertions(4);
        const wrapper = shallow(<LayerFilter text={testText} tooltip={testTooltip}
            filterName={testFilterName} currentStyle={testCurrentStyle} clickHandler={() => console.log('Not called in this test')}/>);

        expect(wrapper.find('div').last().text()).toEqual(testText);
        expect(wrapper.find('center').props().title).toEqual(testTooltip);
        expect(wrapper.find('center').props().filtername).toEqual(testFilterName);
        expect(wrapper.find('div').first().hasClass(testCurrentStyle)).toBeTruthy();
    });
    test('calls click handler once when filter is clicked', () => {
        expect.assertions(1);
        const testClickHandler = jest.fn();
        const wrapper = shallow(<LayerFilter text={testText} tooltip={testTooltip} filterName={testFilterName} currentStyle={testCurrentStyle} clickHandler={testClickHandler}/>);
        wrapper.find('center').simulate('click');
        expect(testClickHandler.mock.calls.length).toEqual(1);
    });
});
