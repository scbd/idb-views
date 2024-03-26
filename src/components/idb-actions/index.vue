<template >
  <div ref="idbActions">
    <Loading v-if="isLoading"/>
    <div v-for="(doc,index) in documents" v-bind:key="index">
      <Action  :document="doc" :options="options" />
    </div>
  </div>
</template>

<script>
import { toRef        , ref, unref } from 'vue';
import { listDocuments }             from '@/composables/api.js';
import   Action                      from '@/components/action.vue';
import   Loading                     from '@/components/Loading.vue';

export default {
  name      : 'IdbActions',
  components: { Action, Loading },
  props     : { options : { type: Object, required: true } },
  setup
}

function setup(props){
  const   isLoading      = ref(true);
  const   documents      = ref([]);
  const   options        = toRef(props, 'options');

  getActions(options).then((responseDocs)=> { 
    documents.value = responseDocs; 
    setTimeout(() => {isLoading.value = !isLoading.value }, 1000);
  } )

  return { options, documents, isLoading }
}


async function getActions(options){
  const { country } = unref(options);

  if(!country)  throw new Error('@scbd/idb-views.IdbActions.getActions: no country passed in view options');

  const   isGlobal       = country.includes('global');
  const   filter         = isGlobal? { 'isGlobal.identifier': { $exists: true } } : { 'address.country.identifier': country, 'isGlobal.identifier': { $exists: false } };
  const   allDocuments   = await listDocuments(filter);

  return allDocuments;
}

</script>


