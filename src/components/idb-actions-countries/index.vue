<template >
  <div  ref="idbActionsCountries">
    <Loading v-if="isLoading"/>
    <div class="mb-5">
      <ol>
        <li v-for="(c,index) in countryList" v-bind:key="index" class="mb-3">
          <img :src="c.image" class="border-top-0 p-0" :alt="c.name" style="border: 0px ; max-width: 32px; margin-right: 10px;">
          <a :href="`${options.countryBaseUrl}/${c.identifier}`">{{c.name}} ({{c.count}})</a>
        </li>
      </ol>
    </div>
    <div >
      <h3 v-if="globalList.length" class="global">{{ t('Global celebrations and more') }}</h3>
      <ul>
        <li v-for="(globalDoc,index) in  globalList" v-bind:key="index" class="mb-3">
          <a :href="`${options.countryBaseUrl}/global#${globalDoc._id}`">{{ t(globalDoc.name) }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { toRef, ref     } from 'vue-demi';
import { listDocuments  } from '@/composables/api.js';
import { getData        } from '@scbd-chm/cached-apis';
import   t                from '@/composables/i18n.js';
import   Loading          from '@/components/Loading.vue';

export default {
  name      : 'IdbActionsCountries',
  components: { Loading },
  props     : { options : { type: Object, required: true } },
  setup
}

function setup(props){
  const   isLoading      = ref(true);
  const   globalList     = ref([]);
  const   countryList    = ref([]);
  const   options        = toRef(props, 'options');


  getCountryList().then((countries)=> { 
    countryList.value = countries;
    setTimeout(() => {isLoading.value = !isLoading.value }, 1000);
  })

  getGlobalList().then((globalDocs)=> globalList.value  = globalDocs);

  return { t, countryList,  globalList, options, isLoading };
}

async function getCountryList(){
  const rawCountries                  = await getData('countries');
  const allDocuments                  = await listDocuments({ 'isGlobal.identifier': { $exists: false } },{ 'address.country.identifier': 1 });
  const allDocumentCountryIdentifiers = (allDocuments.map(({ address })=> address?.country?.identifier)).filter(x => x);

  for (const country of rawCountries) {
      country.count = 0;
      
      for (const countryIdentifier of allDocumentCountryIdentifiers )
        if(country.identifier === countryIdentifier);
          country.count++;
  }

  return rawCountries.filter((c) => c.count);
}

async function getGlobalList(){
  const globalDocuments   = await listDocuments({ 'isGlobal.identifier': { $exists: true } }, { 'name': 1 });

  return globalDocuments;
}
</script>