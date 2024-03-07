import      { createApp   } from 'vue'
import      { createI18n  } from 'vue-i18n'
import      { createPinia } from 'pinia'
import App, { i18n        } from '@/index'

const order   = [
    {
        "name": "Headliner",
        "identifier": "headliner",
        "adminOnly": "true"
      },
      {
        "name": "COP Presidency",
        "identifier": "cop-presidencies"
      },
      {
        "identifier": "8830904C-8AF4-4C2F-AADB-363D98D854DA",
        "name": "Government agency (National/Federal)"
      },
      {
        "identifier": "692b3eb1-a00c-437d-8903-d9b7714a7514",
        "name": "UN and other specialized agency of the UN Common System"
      },
      {
        "identifier": "1C3A4FF4-9AB7-4A34-BE06-E07F575B7A32",
        "name": "Government agency (Sub-national)"
      },
      {
        "identifier": "EC872EB8-02B0-46E7-AAB0-C79AC629356A",
        "name": "Indigenous peoples and local communities (IPLC)"
      },
      {
        "identifier": "64432E86-23C9-4D9A-B835-962D8221E6CA",
        "name": "Inter-governmental organization (IGO)"
      }
]

const options = { 
                    view       : 'IdbMessages',//'IdbActionsCountries',
                    country    : 'ca',
                    year       : 2023,
                    baseApiUrl : 'https://api.cbddev.xyz/api',
                    accountsUrl: 'https://accounts.cbddev.xyz',
                    countryBaseUrl: '',
                    editUrl    : 'https://www.cbd.int/article/idb-2024-action-form',
                    debug      : true,
                    order
                }

const anApp = createApp(App, { options })

anApp.use(createI18n(i18n))
anApp.use(createPinia())

anApp.mount('#app')