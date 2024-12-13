import { RESERVED_LAYER_PARAMS, cleanUrl } from './ServiceUrlInputHelper.js';

describe('ServiceUrlInputHelper Tests ', () => {
    describe('clean url', () => {
        it('should clean out the reserved params ', () => {
            const url = 'http://www.com/?service=WMS&request=GetCapabilities&version=1.1.1';
            const strippedUrl = cleanUrl(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(url.toLowerCase().indexOf(param.toLowerCase())).toBeGreaterThan(-1);
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should clean out reserved params regardless of casing', () => {
            const url = 'http://www.com/?SERVICE=WMS&ReQuEsT=GetCapabilities&version=1.1.1';
            const strippedUrl = cleanUrl(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(url.toLowerCase().indexOf(param.toLowerCase())).toBeGreaterThan(-1);
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should clean out all instances of the same reserved param regardless of casing', () => {
            const url = 'http://www.com/?SERVICE=WMS&service=WFS&SeRViCe=wfs&serVICE=WMS&verSION=6.6.5&VERSion=6.6.4&VeRSion=6.3.0';
            const strippedUrl = cleanUrl(url);
            RESERVED_LAYER_PARAMS.forEach((param) => {
                expect(strippedUrl.toLowerCase().indexOf(param.toLowerCase())).toBe(-1);
            });
        });

        it('should keep other params and their casing', () => {
            const url = 'http://www.com/?first=1&SECOND=2&thiRd=3&SERVICE=WMS';
            const strippedUrl = cleanUrl(url);
            expect(strippedUrl.indexOf('first')).toBeGreaterThan(-1);
            expect(strippedUrl.indexOf('FIRST')).toBe(-1);

            expect(strippedUrl.indexOf('SECOND')).toBeGreaterThan(-1);
            expect(strippedUrl.indexOf('second')).toBe(-1);

            expect(strippedUrl.indexOf('thiRd')).toBeGreaterThan(-1);
            expect(strippedUrl.indexOf('third')).toBe(-1);
            expect(strippedUrl.indexOf('THIRD')).toBe(-1);

            expect(strippedUrl.indexOf('SERVICE')).toBe(-1);
        });

        it('should return undefined with no url provided', () => {
            expect(cleanUrl(null)).toBeUndefined();
        });

        it('should strip protocol from the returned url', () => {
            const httpUrl = 'http://www.com/';
            const httpsUrl = 'https://www.com/';
            expect(cleanUrl(httpUrl)).toBe('www.com/');
            expect(cleanUrl(httpsUrl)).toBe('www.com/');
        });

        it('should be able to handle url without protocol', () => {
            const url = 'www.com/';
            expect(cleanUrl(url)).toBe(url);
        });

        it('should NOT encode URL params', () => {
            const url = 'avoin-karttakuva.maanmittauslaitos.fi/kiinteisto-avoin/tiles/wmts/1.0.0/kiinteistojaotus/default/v3/ETRS-TM35FIN/{z}/{y}/{x}.pbf';
            expect(cleanUrl(url)).toBe(url);

            const url2 = 'www.com/?first=1&SECOND=2&thiRd=3';
            expect(cleanUrl(url2)).toBe(url2);
        });
    });
});
