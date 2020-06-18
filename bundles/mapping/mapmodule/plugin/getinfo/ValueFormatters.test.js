import { getFormatter } from './ValueFormatters';

describe('GetInfoPlugin', () => {
    describe('ValueFormatters', () => {
        describe('getFormatter', () => {
            test('is function', () => {
                expect(typeof getFormatter).toEqual('function');
            });
            test('returns function with no params', () => {
                expect(typeof getFormatter()).toEqual('function');
            });
            test('returns function with param: link', () => {
                expect(typeof getFormatter('link')).toEqual('function');
            });
            test('returns function with param: image', () => {
                expect(typeof getFormatter('image')).toEqual('function');
            });
            test('returns function with param: imageWithLink', () => {
                expect(typeof getFormatter('imageWithLink')).toEqual('function');
            });
            test('returns function with param: number', () => {
                expect(typeof getFormatter('number')).toEqual('function');
            });
            test('formats link value', () => {
                const formatter = getFormatter('link');
                const result = formatter('https://my.domain');
                expect(result).toEqual('<a href="https://my.domain" rel="noreferrer noopener" target="_blank">https://my.domain</a>');
            });
            test('detects link from value and formats as link', () => {
                const formatter = getFormatter();
                const result = formatter('https://my.domain');
                expect(result).toEqual('<a href="https://my.domain" rel="noreferrer noopener" target="_blank">https://my.domain</a>');
            });
            test('formats image value', () => {
                const formatter = getFormatter('image');
                const result = formatter('https://my.domain');
                expect(result).toEqual('<img src="https://my.domain"></img>');
            });
            test('formats image with link value', () => {
                const formatter = getFormatter('image');
                const result = formatter('https://my.domain', {
                    link: true
                });
                expect(result).toEqual('<a href="https://my.domain" rel="noreferrer noopener" target="_blank"><img src="https://my.domain"></img></a>');
            });
        });
    });
});
