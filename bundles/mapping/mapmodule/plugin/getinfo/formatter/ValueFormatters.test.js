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
                const link = 'https://my.domain';
                const result = formatter(link);
                expect(result).toEqual(`<a href="${link}" rel="noreferrer noopener" target="_blank" title="${link}">${link}</a>`);
            });
            test('formats link with label', () => {
                const formatter = getFormatter('link');
                const link = 'https://my.domain';
                const expectedLabel = 'Configured label';
                const result = formatter(link, {
                    label: expectedLabel
                });
                expect(result).toEqual(`<a href="${link}" rel="noreferrer noopener" target="_blank" title="${link}">${expectedLabel}</a>`);
            });
            test('formats long link value', () => {
                const formatter = getFormatter('link');
                const link = 'http://thelongestdomainnameintheworldandthensomeandthensomemoreandmore.com/testing/a very long link?with=params&other=stuff';
                const expectedLabel = 'thelongestdomainnameinthe...with=params&other=stuff';
                const result = formatter(link);
                expect(result).toEqual(`<a href="${link}" rel="noreferrer noopener" target="_blank" title="${link}">${expectedLabel}</a>`);
            });
            test('detects link from value and formats as link', () => {
                // NOTE! We don't give parameter to formatter -> detection
                const formatter = getFormatter();
                const link = 'https://my.domain';
                const result = formatter(link);
                expect(result).toEqual(`<a href="${link}" rel="noreferrer noopener" target="_blank" title="${link}">${link}</a>`);
            });
            test('formats image value', () => {
                const formatter = getFormatter('image');
                const result = formatter('https://my.domain');
                expect(result).toEqual('<img class="oskari_gfi_img" src="https://my.domain"></img>');
            });
            test('formats image with link value', () => {
                const formatter = getFormatter('image');
                const url = 'https://my.domain';
                const result = formatter(url, {
                    link: true
                });
                expect(result).toEqual(`<a href="${url}" rel="noreferrer noopener" target="_blank" title="${url}"><img class="oskari_gfi_img" src="${url}"></img></a>`);
            });
        });
    });
});
