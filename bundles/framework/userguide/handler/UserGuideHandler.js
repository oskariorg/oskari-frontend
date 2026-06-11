import { StateHandler } from 'oskari-ui/util';

const HELP_CONTENT_PART = 'body';

export class UserGuideHandler extends StateHandler {
    constructor () {
        super();
        this.setState({
            tabs: [],
            loading: true
        });
    }

    async loadContent (conf, locale) {
        const localeTabs = locale.tabs || [];
        const helpContentPart = locale.help?.contentPart || HELP_CONTENT_PART;
        const errorMsg = locale.error?.generic || '';

        if (localeTabs.length > 0) {
            const tabs = localeTabs.map(tab => ({
                key: tab.tags,
                title: tab.title,
                url: tab.url || null,
                content: null,
                loading: true
            }));
            this.updateState({
                tabs,
                loading: false
            });

            await Promise.all(tabs.map(async (tab, index) => {
                const data = await this.fetchArticle(tab.key);
                const article = data?.articles?.[0];
                const html = this.getArticleContent(article, helpContentPart, errorMsg);
                const url = article?.url || tab.url || null;
                tabs[index] = {
                    ...tab,
                    content: html,
                    url,
                    loading: false
                };
                this.updateState({
                    tabs: [...tabs]
                });
            }));
        } else {
            let tags = conf.tags || 'userguide';
            if (conf.includeLang) {
                tags = `${tags},${Oskari.getLang()}`;
            }
            this.updateState({
                tabs: [{
                    key: tags,
                    title: null,
                    content: null,
                    loading: true
                }],
                loading: false
            });
            const data = await this.fetchArticle(tags);
            const article = data?.articles?.[0];
            const html = this.getArticleContent(article, helpContentPart, errorMsg);
            this.updateState({
                tabs: [{
                    key: tags,
                    title: null,
                    url: article?.url || null,
                    content: html,
                    loading: false
                }],
                loading: false
            });
        }
    }

    getArticleContent (article, contentPart, errorMsg) {
        if (!article?.content) {
            return errorMsg;
        }
        if (typeof article.content === 'string') {
            return article.content;
        }
        return article.content[contentPart] || errorMsg;
    }

    async fetchArticle (tags) {
        try {
            const url = Oskari.urls.getRoute('GetArticlesByTag', { tags });
            const response = await fetch(url);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (e) {
            return null;
        }
    }
}
