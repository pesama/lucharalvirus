import Vue from 'vue'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
import VuePlaceAutocomplete from 'vue-place-autocomplete'
import 'element-theme-chalk';
import * as VueGoogleMaps from 'vue2-google-maps';


import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from '@/assets/awsmobile';
import messages from '@/messages';

Amplify.configure(awsconfig)

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueI18n)
Vue.use(VuePlaceAutocomplete);

const configService = ConfigurationService.getInstance()
Vue.use(VueGoogleMaps, {
  load: {
    key: configService.get('GMAPS_API_KEY')
  }
});

import App from './App.vue'
import router from './router'
import ConfigurationService from './services/ConfigurationService';

Vue.config.productionTip = false

const locale = require('element-ui/lib/locale/lang/en').default
Vue.use(Element, { locale })

const i18n = new VueI18n({
  locale: 'es', // TODO
  messages
});

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
