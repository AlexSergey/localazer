import Jed from 'jed';
import LocalizationObserver from './LocalizationObserver';
import { isFunction } from 'valid-types';

const l = (text, context) => {
    return function () {
        return translateL(text, context);
    };
};
const nl = (singular, plural, amount, context) => {
    return function () {
        return translateNl(singular, plural, amount, context);
    };
};
const sprintf = (...args) => {
    return function () {
        return translateSprintf.apply(null, args.map(item => (isFunction(item) ? item() : item)));
    };
};

function translateSprintf(...args) {
    return Jed.sprintf.apply(this, args);
}

function translateL(text, context) {
    if (!LocalizationObserver.i18n) {
        return false;
    }
    return context ?
        LocalizationObserver.i18n.pgettext(context, text) :
        LocalizationObserver.i18n.gettext(text);
}

function translateNl(singular, plural, amount, context) {
    if (!Number.isInteger(amount)) {
        return singular;
    }
    if (!LocalizationObserver.i18n) {
        return false;
    }

    return context ?
        LocalizationObserver.i18n.npgettext(context, singular, plural, amount) :
        LocalizationObserver.i18n.ngettext(singular, plural, amount);
}

export { l, nl, sprintf };