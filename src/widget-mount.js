import            { createApp   } from 'vue-demi';
import            { createI18n  } from 'vue-i18n';
import            { createPinia } from 'pinia';
import component, { i18n        } from '@scbd/idb-views';

const { rootProps } = window?.chm?.scbdIdbViews || {};  // required to pass options from single line script tag, only one per page need to fix to use the mountId below as reference
const { search    } = new URL(import.meta.url);         // required to get current context, I hate this no other way
const   mountId     = search.replace("?", "#");         // extract unique mount id from self context url.  It will default to the package name, however, if needed you can add a search param key onto widget entry url ?some-unique which will turn into #package-name or #package-name-some-unique

createApp(component, rootProps)
.use(createI18n(i18n))         //area for app's global use of some libraries if needed.
.use(createPinia())
.mount(mountId)