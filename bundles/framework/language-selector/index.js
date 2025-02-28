import { LanguageSelector } from './LanguageSelector';

const BUNDLE_ID = 'language-selector';
// register create function for bundleid
Oskari.bundle(BUNDLE_ID, () => new LanguageSelector(BUNDLE_ID));
