import Aurelia, { IRouter, RouterConfiguration } from 'aurelia';

import { App } from './app';

Aurelia
  .register(RouterConfiguration.customize({
    useUrlFragmentHash: false,
  }), (router: IRouter) => {
  })
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(App)
  .start();
