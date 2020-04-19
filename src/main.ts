import Aurelia, { LoggerConfiguration, LogLevel, RouterConfiguration } from 'aurelia';
import { I18nConfiguration } from '@aurelia/i18n';
import { HookTypes, ViewportInstruction } from '@aurelia/router';
import { App } from './app';
import en from './locales/en/translations.json';

Aurelia.register(LoggerConfiguration.create(console, LogLevel.debug))
  .register(
    RouterConfiguration.customize({
      useUrlFragmentHash: false,
      hooks: [
        {
          hook: async (
            instrs: ViewportInstruction[]
          ): Promise<ViewportInstruction[]> => {
            if (!Array.isArray(instrs) || instrs.length < 1) {
              return instrs;
            }
            const titles = [];
            let [comp] = instrs.slice(-1);
            do {
              const title = (comp.componentType as any).title;
              if (title) {
                titles.push(
                  typeof title !== 'string'
                    ? title(comp.componentInstance)
                    : title
                );
              }
              [comp] = (comp.nextScopeInstructions ?? []).slice(-1);
            } while (comp);
            const title = titles.length > 0 ? titles.join(' > ') + ' | ' : '';
            document.title = `${title}WarMeister`;
            return instrs;
          },
          options: {
            type: HookTypes.TransformToUrl,
          },
        },
      ],
    })
  )
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
