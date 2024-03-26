<template>
  <div  ref="idbViews" >
    <Icons v-once/>
    <component  :options="opts" :is="opts?.view" />
  </div>
</template>

<script>

import { toRef, ref, defineAsyncComponent } from 'vue';

import { useI18n            } from 'vue-i18n';
import { initializeApiStore } from '@scbd-chm/cached-apis';

import { useAuthStore     } from '@/composables/stores/auth';
import { useMeStore       } from '@/composables/stores/me';
import { useOptionsStore  } from '@/composables/stores/options';
import { useFeedbackStore } from '@/composables/stores/feedback';

import Icons    from './Icons.vue';
import Loading  from '@/components/Loading.vue';

const IdbMessages          = defineAsyncComponent({ loader: () => import('@/components/idb-messages/index.vue'),           loadingComponent: Loading, delay: 10, timeout: 5000 });
const IdbMessagesAdmin     = defineAsyncComponent({ loader: () => import('@/components/idb-messages-admin/index.vue'),     loadingComponent: Loading, delay: 10, timeout: 5000 });
const IdbMessagesCommunity = defineAsyncComponent({ loader: () => import('@/components/idb-messages-community/index.vue'), loadingComponent: Loading, delay: 10, timeout: 5000 });
const IdbActionsCountries  = defineAsyncComponent({ loader: () => import('@/components/idb-actions-countries/index.vue'),  loadingComponent: Loading, delay: 10, timeout: 5000 });
const IdbActionsAdmin      = defineAsyncComponent({ loader: () => import('@/components/idb-actions-admin/index.vue'),      loadingComponent: Loading, delay: 10, timeout: 5000 });
const IdbActions           = defineAsyncComponent({ loader: () => import('@/components/idb-actions/index.vue'),            loadingComponent: Loading, delay: 10, timeout: 5000 });

export default {
  name      : 'IDB-views',
  props     : { options    : { type: Object } },
  components: { Loading, Icons, IdbMessages, IdbMessagesAdmin, IdbMessagesCommunity, IdbActionsCountries, IdbActionsAdmin, IdbActions },
  created,  setup
}

const checkAuth =  (user) => async (mutation) => {
  const auth = useAuthStore();

  if (!mutation.payload?.accountsUrl) return;


  auth.$patch({ accountsUrl: mutation.payload.accountsUrl});
        
  const me = useMeStore();

  user.value = await me.getUser();

  if(user.value?.userID && user.value.userID !== 1) return;

  setTimeout(async ()=>user.value = await me.getUser(), 500);
  setTimeout(async ()=>user.value = await me.getUser(), 1500);
}


function setup(props){
  const   $i18n          = useI18n({ useScope: 'global' });
  const   idbViews       = ref(null);
  const   user           = ref(null);
  const   options        = ref({});
  const   optionsRef     = toRef(props, 'options');
  const { t, locale }    = $i18n;

  const optionsStore   = useOptionsStore ();
  const feedbackStore  = useFeedbackStore();

  optionsStore.$subscribe(checkAuth(user));

  optionsStore.loadOptions(optionsRef).then(async (o) => {
    options.value = o;
  })

  return { t, idbViews, user, feedbackStore, opts: options };
}

function created(){ 
  initializeApiStore();
}

</script>

<style>

:root {
  --vv-primary-color: #0071fe;
  --vv--error-color: #f23648;
  --vv--error-bg-color: #fddfe2;
  --vv--success-color: #21a67a;
  --vv--success-bg-color: #e0eee4;
}
</style>
