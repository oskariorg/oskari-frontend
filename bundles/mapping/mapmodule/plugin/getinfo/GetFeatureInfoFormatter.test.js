import './GetInfoPlugin';
import './GetFeatureInfoFormatter';

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.GetInfoPlugin');
const removeWhitespace = (content) => content.replace(/\s/g, '');

describe('GetInfoPlugin', () => {
    describe('formatters', () => {
        describe('html', () => {
            const content = `
                <div>
                    <script>alert('Bazinga!')</script>
                </div>
            `;
            test('is function', () => {
                expect(typeof plugin.formatters.html).toEqual('function');
            });
            test('returns jQuery object', () => {
                const result = plugin.formatters.html(content);
                expect(result instanceof jQuery).toEqual(true);
            });
            test('wraps content to additional div', () => {
                const result = plugin.formatters.html(`My data`);
                expect(result.outerHTML()).toEqual('<div>My data</div>');

                const result2 = plugin.formatters.html(`<div></div>`);
                expect(removeWhitespace(result2.outerHTML())).toEqual('<div><div></div></div>');
            });
            test('removes script tags', () => {
                const result = plugin.formatters.html(content);
                const scriptTags = result.find('script');
                expect(scriptTags.length).toEqual(0);
            });
        });
    });
});
