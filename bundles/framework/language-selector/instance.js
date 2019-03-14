const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.bundle.language-selector.instance',
    class LanguageSelector extends BasicBundle {
        constructor () {
            super();
            var a = 5;
            a++;
        }
        _startImpl () {
            console.log('Start!');
        }
    }
);
