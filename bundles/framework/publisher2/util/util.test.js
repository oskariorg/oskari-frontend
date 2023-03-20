import { mergeValues, isEmpty } from './util';

describe('Publisher/util', () => {
    describe('isEmpty === true', () => {
        test('null', () => {
            expect(isEmpty(null)).toEqual(true);
        });
        test('undefined', () => {
            expect(isEmpty()).toEqual(true);
        });
        test('[]', () => {
            expect(isEmpty([])).toEqual(true);
        });
        test('{}', () => {
            expect(isEmpty({})).toEqual(true);
        });
    });
    describe('isEmpty === false', () => {
        test('0', () => {
            expect(isEmpty(0)).toEqual(false);
        });
        test('45', () => {
            expect(isEmpty(45)).toEqual(false);
        });
        test('["testing"]', () => {
            expect(isEmpty(['testing'])).toEqual(false);
        });
        test('{ testing: true }', () => {
            expect(isEmpty({testing: true})).toEqual(false);
        });
    });
    describe('mergeValues', () => {
        test('mergeValues({}, null)', () => {
            const merged = mergeValues({}, null);
            expect(Object.keys(merged).length).toEqual(0);
        });
        test('mergeValues({}, {})', () => {
            const merged = mergeValues({}, {});
            expect(Object.keys(merged).length).toEqual(0);
        });
        test('mergeValues({testing: 1}, null)', () => {
            const merged = mergeValues({
                testing: 1
            }, null);
            expect(merged.testing).toEqual(1);
        });
        test('mergeValues({testing: 1}, {})', () => {
            const merged = mergeValues({
                testing: 1
            }, {});
            expect(JSON.stringify(merged)).toEqual(`{"testing":1}`);
        });
        test('mergeValues({testing: 1}, {testing: 2})', () => {
            const merged = mergeValues({
                testing: 1
            }, {
                testing: 2
            });
            expect(JSON.stringify(merged)).toEqual(`{"testing":2}`);
        });
        test('mergeValues({testing: 1}, {testing2: 2})', () => {
            const merged = mergeValues({
                testing: 1
            }, {
                testing2: 2
            });
            expect(JSON.stringify(merged)).toEqual(`{"testing":1,"testing2":2}`);
        });
        test('mergeValues({testing: ["testing"]}, {testing: 2})', () => {
            const merged = mergeValues({
                testing: ['testing']
            }, {
                testing: 2
            });
            expect(JSON.stringify(merged)).toEqual(`{"testing":["testing"]}`);
        });
        test('mergeValues({testing: ["testing"]}, {testing: "testing"})', () => {
            const merged = mergeValues({
                testing: ['testing']
            }, {
                testing: ['testing']
            });
            expect(JSON.stringify(merged)).toEqual(`{"testing":["testing","testing"]}`);
        });
        test('mergeValues({testing.test = arrays})', () => {
            const merged = mergeValues({
                testing: {
                    test: ['testing']
                }
            }, {
                testing: {
                    test: [{'id': 'testingId'}]
                }
            });
            expect(JSON.stringify(merged, null, 4)).toEqual(
`{
    "testing": {
        "test": [
            "testing",
            {
                "id": "testingId"
            }
        ]
    }
}`);
        });
    });
});
