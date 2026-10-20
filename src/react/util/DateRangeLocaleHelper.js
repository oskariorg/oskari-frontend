import dayjs from 'dayjs';

const LOCALE_BUNDLE = 'oskariui';
const LOCALE_KEY = 'DateRange';
const DEFAULT_LANGUAGE = 'en';

const localizeValue = (value, language) => {
    if (Array.isArray(value)) {
        return value.map((date) => localizeValue(date, language));
    }
    return dayjs.isDayjs(value) ? value.locale(language) : value;
};

const getLocalizedProps = (props, configuration) => {
    if (!configuration?.dayjs || !configuration.lang) {
        return props;
    }
    const { dayjs: dateLocale, ...pickerLocale } = configuration;
    dayjs.locale({
        ...dayjs.Ls[DEFAULT_LANGUAGE],
        ...dateLocale
    });
    return {
        locale: pickerLocale,
        ...props,
        value: localizeValue(props.value, dateLocale.name),
        defaultValue: localizeValue(props.defaultValue, dateLocale.name)
    };
};

export const getLocalizedDatePickerProps = (props) => getLocalizedProps(
    props,
    Oskari.getMsg(LOCALE_BUNDLE, LOCALE_KEY, null, null)
);