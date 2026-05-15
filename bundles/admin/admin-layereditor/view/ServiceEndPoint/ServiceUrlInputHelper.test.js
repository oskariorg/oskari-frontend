import { RESERVED_LAYER_PARAMS, cleanUrlAndExtractParams, getFullServiceUrl } from './ServiceUrlInputHelper.js';

describe('ServiceUrlInputHelper Tests ', () => {
    describe('clean url', () => {
        it('should clean out the reserved params ', () => {
            const url = 'http://www.com/?service=WMS&request=GetCapabilities&version=1.1.1';
            const { cleanedUrl: strippedUrl } = cleanUrlAndExtractParams(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(url.toLowerCase().indexOf(param.toLowerCase())).toBeGreaterThan(-1);
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should clean out reserved params regardless of casing', () => {
            const url = 'http://www.com/?SERVICE=WMS&ReQuEsT=GetCapabilities&version=1.1.1';
            const { cleanedUrl: strippedUrl } = cleanUrlAndExtractParams(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(url.toLowerCase().indexOf(param.toLowerCase())).toBeGreaterThan(-1);
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should clean out all instances of the same reserved param regardless of casing', () => {
            const url = 'http://www.com/?SERVICE=WMS&service=WFS&SeRViCe=wfs&serVICE=WMS&verSION=6.6.5&VERSion=6.6.4&VeRSion=6.3.0';
            const { cleanedUrl: strippedUrl } = cleanUrlAndExtractParams(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should clean out also non-reserved params from url', () => {
            const url = 'http://www.com/?first=1&SECOND=2&thiRd=3&SERVICE=WMS';
            const { cleanedUrl: strippedUrl } = cleanUrlAndExtractParams(url);
            expect(strippedUrl.indexOf('first')).toBe(-1);
            expect(strippedUrl.indexOf('SECOND')).toBe(-1);
            expect(strippedUrl.indexOf('thiRd')).toBe(-1);
            expect(strippedUrl.indexOf('SERVICE')).toBe(-1);
        });

        it('should extract non-reserved params and keep their casing in params object', () => {
            const url = 'http://www.com/?first=1&SECOND=2&thiRd=3&SERVICE=WMS';
            const { params } = cleanUrlAndExtractParams(url);
            expect(params).toEqual({
                first: '1',
                SECOND: '2',
                thiRd: '3'
            });
            expect(params.SERVICE).toBeUndefined();
        });

        it('should return undefined with no url provided', () => {
            const result = cleanUrlAndExtractParams(null);
            expect(result.cleanedUrl).toBeUndefined();
            expect(result.params).toBeUndefined();
        });

        it('should strip protocol from the returned url', () => {
            const httpUrl = 'http://www.com/';
            const httpsUrl = 'https://www.com/';
            expect(cleanUrlAndExtractParams(httpUrl).cleanedUrl).toBe('www.com/');
            expect(cleanUrlAndExtractParams(httpsUrl).cleanedUrl).toBe('www.com/');
        });

        it('should be able to handle url without protocol', () => {
            const url = 'www.com/';
            expect(cleanUrlAndExtractParams(url).cleanedUrl).toBe(url);
        });

        it('should NOT encode URL params', () => {
            const url = 'avoin-karttakuva.maanmittauslaitos.fi/kiinteisto-avoin/tiles/wmts/1.0.0/kiinteistojaotus/default/v3/ETRS-TM35FIN/{z}/{y}/{x}.pbf';
            expect(cleanUrlAndExtractParams(url).cleanedUrl).toBe(url);

            const url2 = 'www.com/?first=1&SECOND=2&thiRd=3';
            expect(cleanUrlAndExtractParams(url2).cleanedUrl).toBe('www.com/');
        });
    });

    describe('get full service url', () => {
        it('should return empty string with no url provided', () => {
            expect(getFullServiceUrl({})).toBe('');
            expect(getFullServiceUrl({ url: '' })).toBe('');
        });

        it('should add https protocol when missing and append params', () => {
            const fullUrl = getFullServiceUrl({
                url: 'www.com/path',
                params: {
                    first: '1',
                    second: 'two'
                }
            });
            expect(fullUrl).toBe('https://www.com/path?first=1&second=two');
        });

        it('should preserve existing protocol', () => {
            const fullUrl = getFullServiceUrl({
                url: 'http://www.com/path',
                params: {
                    first: '1'
                }
            });
            expect(fullUrl).toBe('http://www.com/path?first=1');
        });

        it('should stringify param values and skip nullish values', () => {
            const fullUrl = getFullServiceUrl({
                url: 'https://www.com/',
                params: {
                    bool: false,
                    num: 0,
                    empty: '',
                    nil: null,
                    undef: undefined
                }
            });
            expect(fullUrl).toBe('https://www.com/?bool=false&num=0&empty=');
        });
    });
});
