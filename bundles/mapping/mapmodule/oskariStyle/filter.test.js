import { filterOptionalStyle } from './filter';
import olFeature from 'ol/Feature';

const featureProps = [{
    name: 'Helsinki',
    type: 'city',
    population: 600000,
    capital: true
}, {
    name: 'Sipoo',
    type: 'town',
    population: 25000,
    capital: false
}, {
    name: 'Tampere',
    type: 'city',
    population: 200000,
    capital: false
}, {
    name: 'Puuppola',
    type: 'village',
    population: 4000,
    capital: false
}];

const olFeatures = featureProps.map(props => new olFeature(props));

const getFilteredFeatures = filter => olFeatures.filter(f => filterOptionalStyle(filter, f));

const getFilteredNames = filter => getFilteredFeatures(filter).map(f => f.get('name'));

const createPropertyFilter = (key, operator, value) => {
    const filter = {
        property: {
            key
        }
    };
    filter.property[operator] = value;
    return filter;
};

const exclusiveRange = {
    property: {
        key: 'population',
        greaterThan: 4000,
        lessThan: 200000
    }
};
const inclusiveRange = {
    property: {
        key: 'population',
        atLeast: 4000,
        atMost: 200000
    }
};
const andFilter = {
    AND: [
        {
            key: 'type',
            value: 'city'
        }, {
            key: 'population',
            greaterThan: 20000
        }
    ]
};
const orFilter = {
    OR: [
        {
            key: 'name',
            in: ['Tampere']
        }, {
            key: 'type',
            value: 'village'
        }
    ]
};

describe('filterOptionalStyle', () => {
    test('equal filters', () => {
        expect.assertions(7);
        const stringFilter = createPropertyFilter('name', 'value', 'helsinki'); // caseSensitive defaults to false
        let names = getFilteredNames(stringFilter);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Helsinki']);
        stringFilter.property.caseSensitive = true;
        expect(getFilteredNames(stringFilter).length).toBe(0);

        const numberFilter = createPropertyFilter('population', 'value', 200000);
        names = getFilteredNames(numberFilter);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Tampere']);

        const booleanFilter = createPropertyFilter('capital', 'value', true);
        names = getFilteredNames(booleanFilter);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Helsinki']);
    });
    test('range filters', () => {
        expect.assertions(8);
        let names = getFilteredNames(exclusiveRange);
        expect(names.length).toBe(1);
        expect(names).toEqual(expect.arrayContaining(['Sipoo']));

        names = getFilteredNames(inclusiveRange);
        expect(names.length).toBe(3);
        expect(names).not.toEqual(expect.arrayContaining(['Helsinki']));

        const greaterThan = createPropertyFilter('population', 'greaterThan', 4000);
        names = getFilteredNames(greaterThan);
        expect(names.length).toBe(3);
        expect(names).not.toEqual(expect.arrayContaining(['Puuppola']));

        const lessThan = createPropertyFilter('population', 'lessThan', 600000);
        names = getFilteredNames(lessThan);
        expect(names.length).toBe(3);
        expect(names).not.toEqual(expect.arrayContaining(['Helsinki']));
    });
    test('in filters', () => {
        expect.assertions(6);
        const inFilter = createPropertyFilter('name', 'in', ['Helsinki', 'tampere']);
        let names = getFilteredNames(inFilter);
        expect(names.length).toBe(2);
        expect(names).toEqual(expect.arrayContaining(['Helsinki', 'Tampere']));

        inFilter.property.caseSensitive = true;
        names = getFilteredNames(inFilter);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Helsinki']);

        const notInFilter = createPropertyFilter('name', 'notIn', ['Helsinki', 'tampere']);
        names = getFilteredNames(notInFilter);
        expect(names.length).toBe(2);
        expect(names).not.toEqual(expect.arrayContaining(['Helsinki', 'Tampere']));
    });
    test('like filters', () => {
        expect.assertions(8);
        const endAsterisk = createPropertyFilter('name', 'like', 'Hels*');
        let names = getFilteredNames(endAsterisk);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Helsinki']);

        const likeFilter = createPropertyFilter('name', 'like', '*po*');
        names = getFilteredNames(likeFilter);
        expect(names.length).toBe(2);
        expect(names).toEqual(expect.arrayContaining(['Sipoo', 'Puuppola']));

        const startAsterisk = createPropertyFilter('name', 'like', '*ere');
        names = getFilteredNames(startAsterisk);
        expect(names.length).toBe(1);
        expect(names).toEqual(['Tampere']);

        const notFilter = createPropertyFilter('name', 'notLike', '*ere');
        names = getFilteredNames(notFilter);
        expect(names.length).toBe(3);
        expect(names).not.toEqual(expect.arrayContaining(['Tampere']));
    });
    test('AND filter', () => {
        expect.assertions(2);
        const names = getFilteredNames(andFilter);
        expect(names.length).toBe(2);
        expect(names).toEqual(expect.arrayContaining(['Tampere', 'Helsinki']));
    });
    test('OR filter', () => {
        expect.assertions(2);
        const names = getFilteredNames(orFilter);
        expect(names.length).toBe(2);
        expect(names).toEqual(expect.arrayContaining(['Tampere', 'Puuppola']));
    });
});
