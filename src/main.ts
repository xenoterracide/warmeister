import Aurelia, {
  LoggerConfiguration,
  LogLevel,
  RouterConfiguration,
} from 'aurelia';
import { I18nConfiguration } from '@aurelia/i18n';
import { App } from './app';
import en from './locales/en/translations.json';

Aurelia.register(LoggerConfiguration.create(console, LogLevel.debug))
  .register(RouterConfiguration)
  .register(
    I18nConfiguration.customize((options) => {
      (options.translationAttributeAliases = ['i18n']),
        (options.initOptions = {
          resources: {
            en: { translation: en },
          },
        });
    })
  )
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(App)
  .start();
