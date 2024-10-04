import { getUrl, prettifyParagraph, linkifyParagraph } from './util';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const ipsum = 'Maecenas vitae quam et diam dictum ultricies pulvinar vitae lorem.';
const dolor = 'Curabitur blandit.';

describe('getUrl function', () => {
    test('returns url', () => {
        expect.assertions(1);
        const content = 'http://example.com/index.html';
        const url = getUrl(content);
        expect(url).toEqual(content);
    });

    test('returns url', () => {
        expect.assertions(1);
        const content = 'https://foo-bar.exa_mple.com/path?query=true';
        const url = getUrl(content);
        expect(url).toEqual(content);
    });

    test('returns www url prefixed with http://', () => {
        expect.assertions(1);
        const content = 'www.example.com/index.html';
        const url = getUrl(content);
        const prefix = 'http://';
        expect(url).toEqual(prefix + content);
    });

    test('returns url from content without white spaces', () => {
        expect.assertions(1);
        const url = 'https://foo-bar.exa_mple.com/path?query=true';
        const content = `${lorem} ${url} ${ipsum}`;
        const parsed = getUrl(content);
        expect(parsed).toEqual(url);
    });
});

describe('prettifyParagraph function', () => {
    test('returns content without new line as it is', () => {
        expect.assertions(1);
        const content = `${lorem} ${ipsum} ${dolor}`;
        const paragraphs = prettifyParagraph(content);
        expect(paragraphs).toEqual(content);
    });

    test('returns both lines splitted to own paragraphs', () => {
        expect.assertions(3);
        const content = `${lorem}${ipsum}\n${dolor}`;
        const paragraphs = prettifyParagraph(content);
        expect(paragraphs.length).toEqual(2);
        expect(paragraphs[0]).toEqual(lorem + ipsum);
        expect(paragraphs[1]).toEqual(dolor);
    });

    test('returns each lines splitted to own paragraphs', () => {
        expect.assertions(4);
        const content = `${lorem}\n\n${lorem} \n \n \n ${lorem}`;
        const paragraphs = prettifyParagraph(content);
        expect(paragraphs.length).toEqual(3);
        paragraphs.forEach(expected => expect(expected).toEqual(lorem));
    });
});

describe('linkifyParagraph function', () => {
    const label = 'This is link';
    const url = 'https://foo-bar.exa_mple.com/path?query=true';
    const aTag = `<a href=${url} foo=bar>${label}</a>`;
    const ulrLink = { url };
    const aLink = { url, label };
    test('returns paragraph without links as it is', () => {
        expect.assertions(1);
        const parsed = linkifyParagraph(lorem);
        expect(parsed).toEqual(lorem);
    });
    test('returns parsed link object', () => {
        expect.assertions(1);
        const parsed = linkifyParagraph(url);
        expect(parsed).toEqual(ulrLink);
    });

    test('returns parsed link object', () => {
        expect.assertions(1);
        const parsed = linkifyParagraph(aTag);
        expect(parsed).toEqual(aLink);
    });
    test('returns array containing paragraphs and links in right order', () => {
        expect.assertions(5);
        const content = `${url} ${lorem} ${url} ${ipsum}`;
        const parsed = linkifyParagraph(content);
        expect(parsed.length).toEqual(4);
        expect(parsed[0]).toEqual(ulrLink);
        expect(parsed[1]).toEqual(' ' + lorem + ' ');
        expect(parsed[2]).toEqual(ulrLink);
        expect(parsed[3]).toEqual(' ' + ipsum);
    });
    test('returns array containing paragraphs and links in right order', () => {
        expect.assertions(2);
        const content = [lorem, url, ipsum, aTag, dolor, url, url, `${lorem} ${ipsum} ${dolor}`, aTag, aTag, `${lorem} ${ipsum}`, url, aTag, ipsum];
        const paragraph = content.join(' ');
        const expected = content.map(p => {
            if (p === url) return ulrLink;
            if (p === aTag) return aLink;
            return p;
        });
        const parsed = linkifyParagraph(paragraph);
        // Trim white spaces added in join and filter empty strings between link and/or aTag
        const trimmed = parsed.map(p => typeof p === 'string' ? p.trim() : p).filter(nonEmpty => nonEmpty);
        expect(trimmed.length).toEqual(expected.length);
        expect(trimmed).toEqual(expected);
    });
});
