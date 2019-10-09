
import '../../../../src/global';
import '../domain/AbstractLayer';
import '../resources/locale/en.js';
import './map.state';
import { UnsupportedLayerSrs } from '../domain/UnsupportedLayerSrs';
import { UnsupportedLayerReason } from '../domain/UnsupportedLayerReason';

const Oskari = window.Oskari;
const sandbox = Oskari.getSandbox();

const stateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
sandbox.registerService(stateService);
const map = sandbox.getMap();

describe('Layer ', () => {
    const layer = Oskari.clazz.create('Oskari.mapframework.domain.AbstractLayer');
    const unsupportedSrs = new UnsupportedLayerSrs();
    map.addLayerSupportCheck(unsupportedSrs);

    test('with EPSG:3067 projection is supported by default.', () => {
        layer.setSrsList(['EPSG:3067']);
        expect(map.isLayerSupported(layer)).toEqual(true);
    });
    test('has no reasons to be unsupported.', () => {
        expect(map.getUnsupportedLayerReasons(layer)).toBeUndefined();
    });
    test('with EPSG:3857 projection is not supported in by default', () => {
        layer.setSrsList(['EPSG:3857']);
        expect(map.isLayerSupported(layer)).toEqual(false);
    });
    test(`is not supported because ${unsupportedSrs.getDescription()}`, () => {
        layer.setSrsList(['EPSG:3857']);
        expect(map.getUnsupportedLayerReasons(layer)).toEqual([unsupportedSrs]);
    });
});

describe('groupUnsupportedLayerReasons', () => {
    test('returns undefined when reasons are not provided', () => {
        expect(map.groupUnsupportedLayerReasons()).toBeUndefined();
    });
    test('returns reasons correctly in groups', () => {
        expect.assertions(9);

        const info1 = new UnsupportedLayerReason(1, UnsupportedLayerReason.INFO);
        const info2 = new UnsupportedLayerReason(2, UnsupportedLayerReason.INFO);
        const warning1 = new UnsupportedLayerReason(3, UnsupportedLayerReason.WARNING);
        const warning2 = new UnsupportedLayerReason(4, UnsupportedLayerReason.WARNING);
        const warning3 = new UnsupportedLayerReason(5, UnsupportedLayerReason.WARNING);
        const fatal = new UnsupportedLayerReason(6, UnsupportedLayerReason.FATAL);

        const reasons = [];
        reasons.push(info1);
        reasons.push(info2);
        reasons.push(warning1);
        reasons.push(warning2);
        reasons.push(warning3);
        reasons.push(fatal);

        const groups = map.groupUnsupportedLayerReasons(reasons);
        expect(groups.infos.length).toEqual(2);
        expect(groups.infos).toContain(info1);
        expect(groups.infos).toContain(info2);

        expect(groups.warnings.length).toEqual(3);
        expect(groups.warnings).toContain(warning1);
        expect(groups.warnings).toContain(warning2);
        expect(groups.warnings).toContain(warning3);

        expect(groups.fatals.length).toEqual(1);
        expect(groups.fatals).toContain(fatal);
    });
});

describe('getMostSevereUnsupportedLayerReason', () => {
    test('returns undefined when reasons are not provided', () => {
        expect(map.getMostSevereUnsupportedLayerReason()).toBeUndefined();
    });
    test('returns first INFO reason when reasons with severity INFO is provided', () => {
        const reasons = [];
        const expected = new UnsupportedLayerReason(1, UnsupportedLayerReason.INFO);
        reasons.push(expected);
        reasons.push(new UnsupportedLayerReason(2, UnsupportedLayerReason.INFO));

        expect(map.getMostSevereUnsupportedLayerReason(reasons)).toEqual(expected);
    });
    test('returns first WARNING reason when reasons with severity WARNING and INFO is provided', () => {
        const reasons = [];
        const expected = new UnsupportedLayerReason(3, UnsupportedLayerReason.WARNING);
        reasons.push(new UnsupportedLayerReason(1, UnsupportedLayerReason.INFO));
        reasons.push(new UnsupportedLayerReason(2, UnsupportedLayerReason.INFO));
        reasons.push(expected);
        reasons.push(new UnsupportedLayerReason(4, UnsupportedLayerReason.WARNING));

        expect(map.getMostSevereUnsupportedLayerReason(reasons)).toEqual(expected);
    });
    test('returns first FATAL reason when reasons with severity FATAL,WARNING and INFO is provided', () => {
        const reasons = [];
        const expected = new UnsupportedLayerReason(5, UnsupportedLayerReason.FATAL);
        reasons.push(new UnsupportedLayerReason(1, UnsupportedLayerReason.INFO));
        reasons.push(new UnsupportedLayerReason(2, UnsupportedLayerReason.INFO));
        reasons.push(new UnsupportedLayerReason(3, UnsupportedLayerReason.WARNING));
        reasons.push(new UnsupportedLayerReason(4, UnsupportedLayerReason.WARNING));
        reasons.push(expected);
        reasons.push(new UnsupportedLayerReason(6, UnsupportedLayerReason.FATAL));

        expect(map.getMostSevereUnsupportedLayerReason(reasons)).toEqual(expected);
    });
    test('returns first FATAL reason when reasons with severity FATAL and INFO is provided', () => {
        const reasons = [];
        const expected = new UnsupportedLayerReason(3, UnsupportedLayerReason.FATAL);
        reasons.push(new UnsupportedLayerReason(1, UnsupportedLayerReason.INFO));
        reasons.push(new UnsupportedLayerReason(2, UnsupportedLayerReason.INFO));
        reasons.push(expected);
        reasons.push(new UnsupportedLayerReason(4, UnsupportedLayerReason.FATAL));

        expect(map.getMostSevereUnsupportedLayerReason(reasons)).toEqual(expected);
    });
});
