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
                content: null,
                loading: true
            }));
            this.updateState({
                tabs,
                loading: false
            });

            await Promise.all(tabs.map(async (tab, index) => {
                const html = await this.fetchArticle(tab.key, helpContentPart, errorMsg);
                tabs[index] = { ...tab, content: html, loading: false };
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
            const html = await this.fetchArticle(tags, helpContentPart, errorMsg);
            this.updateState({
                tabs: [{
                    key: tags,
                    title: null,
                    content: html,
                    loading: false
                }],
                loading: false
            });
        }
    }

    async fetchArticle (tags, contentPart, errorMsg) {
        try {
            const url = Oskari.urls.getRoute('GetArticlesByTag', { tags });
            const response = await fetch(url);
            if (!response.ok) {
                return errorMsg;
            }
            const data = await response.json();
            const article = data?.articles?.[0];
            if (!article?.content) {
                return errorMsg;
            }
            return article.content[contentPart] || article.content || errorMsg;
        } catch (e) {
            return errorMsg;
        }
    }
}
