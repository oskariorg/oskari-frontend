import React from 'react';
import { shallow } from 'enzyme';
import { LayerFilter } from './LayerFilter';

describe('<LayerFilter/> ', () => {
    const testText = 'test_text';
    const testTooltip = 'test_tooltip';
    const testFilterName = 'test_filterName';
    const testClassNameDeactive = 'test_classNameDeactive';

    test('sets props correctly', () => {
        expect.assertions(4);
        const wrapper = shallow(<LayerFilter text={testText} tooltip={testTooltip}
            filterName={testFilterName} classNameDeactive={testClassNameDeactive} clickHandler={() => console.log('Not used in this test')}/>);

        expect(wrapper.find('div').last().text()).toEqual(testText);
        expect(wrapper.find('center').props().title).toEqual(testTooltip);
        expect(wrapper.find('center').props().filtername).toEqual(testFilterName);
        expect(wrapper.find('div').first().hasClass(testClassNameDeactive)).toBeTruthy();
    });
    test('calls clickhandler once when clicked', () => {
        expect.assertions(1);
        const testClickHandler = jest.fn();
        const wrapper = shallow(<LayerFilter text={testText} tooltip={testTooltip} filterName={testFilterName} classNameDeactive={testClassNameDeactive} clickHandler={testClickHandler}/>);
        wrapper.find('center').simulate('click');
        expect(testClickHandler.mock.calls.length).toEqual(1);
    });
});
