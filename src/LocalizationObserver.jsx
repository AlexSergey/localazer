import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Jed from 'jed';
import { getDefault } from './utils';
import { isFunction, isDefined, isObject, isString } from 'valid-types';

class LocalizationObserver extends Component {
    constructor(props) {
        super(props);
        LocalizationObserver.i18n = new Jed(props.active);
        LocalizationObserver.components = {};
        LocalizationObserver.uid = 0;
    }

    changeLocalization(locale) {
        locale = this.props.languages[locale] ? locale : this.props.default;
        let localeData = this.props.languages[locale] ? this.props.languages[locale] : getDefault(this.props.default);

        this.updateComponents(localeData, locale);
    }

    updateComponents(localeData, locale) {
        if (localeData && isObject(localeData.locale_data) && isObject(localeData.locale_data.messages)) {
            if (isFunction(this.props.onChange) && isString(locale)) {
                this.props.onChange(locale);
            }

            LocalizationObserver.i18n.options = localeData;

            Object.keys(LocalizationObserver.components).forEach(uid => {
                if (isDefined(LocalizationObserver.components[uid])) {
                    LocalizationObserver.components[uid].forceUpdate();
                }
            });
        }
    }

    componentDidMount() {
        if (this.props.active !== this.props.default) {
            this.changeLocalization(this.props.active);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.active !== prevProps.active) {
            this.changeLocalization(this.props.active);
        }
    }

    render() {
        return this.props.children ? this.props.children : null;
    }
}

LocalizationObserver.defaultProps = {
    active: 'en',
    default: 'en',
    languages: {}
};

LocalizationObserver.propTypes = {
    active: PropTypes.string,
    default: PropTypes.string,
    languages: PropTypes.object,
    onChange: PropTypes.func
};

export default LocalizationObserver;