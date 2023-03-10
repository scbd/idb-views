import            { createApp   } from 'vue-demi';
import            { createI18n  } from 'vue-i18n';
import            { createPinia } from 'pinia';
import component, { i18n        } from '@scbd/idb-views';

const { rootProps } = window?.chm?.scbdIdbViews || {};
const { search }    = new URL(import.meta.url);
const   mountId     = search.replace("?", "#");

createApp(component, rootProps)
.use(createI18n(i18n))
.use(createPinia())
.mount(mountId)