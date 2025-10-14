import { MapLayerBase } from './MapLayerBase';
import { MapLayerWMS } from './MapLayerWMS';

const base = new MapLayerBase(1, 'joo', 'nimi');

describe('MapLayerBase', () => {
    test('test base', () => {
        expect.assertions(3);
        expect(base.getName()).toBe('nimi');
        expect(base.getId()).toBe(1);
        expect(base.getType()).toBe('joo');
    });
    test('test wms', () => {
        const wms = new MapLayerWMS(2, 'moi', 'wmsnimi');
        expect.assertions(4);
        expect(wms.getName()).toBe('wmsnimi');
        expect(wms.getId()).toBe(2);
        expect(wms.getType()).toBe('WMS');
        wms.updateData({ name: 'jee' });
        expect(wms.getName()).toBe('jee');
    });
});
