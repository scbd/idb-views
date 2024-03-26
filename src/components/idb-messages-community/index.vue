<template >
  <div ref="idbMessagesCommunity">
    <Loading v-if="isLoading"/>
    <div v-for="(doc,index) in documents" v-bind:key="index">
      <Message :document="doc" :options="options" />
    </div>
  </div>
</template>

<script>
import { toRef        , ref, unref } from 'vue';
import { lookUp        , getData   } from '@scbd-chm/cached-apis';
import { listDocuments             } from '@/composables/api.js';

import t       from '@/composables/i18n.js';
import isAdmin from '@/composables/is-admin.js';
import Message from '@/components/message.vue';
import Loading from '@/components/Loading.vue';

export default {
  name      : 'IdbMessagesCommunity',
  components: { Message, Loading },
  props     : { options : { type: Object, required: true } },
  setup
}

const additionalOptions = [
  {

    identifier : 'headliner',
    name       : 'Headliner',
    adminOnly  : 'true'
  },
  {

    identifier : 'cop-presidencies',
    name       : 'COP Presidency'
  },
  {
    identifier : 'individual',
    name       : 'Individual'

  }
];

function setup(props){
  const   isLoading      = ref(true);
  const   documents      = ref([]);
  const   options        = toRef(props, 'options');
  const   setupFunctions = { t, isAdmin };

  getAllOrgTypes(options).then((typeIdentifiers) => {

    listDocuments({ 'type.identifier' : {$in: typeIdentifiers}}).then(async (responseDocs)=>{
                documents.value = responseDocs;

                return documents;
              }).then(loadCOuntriesNames)
              .then(() => setTimeout(() => {isLoading.value = !isLoading.value }, 1000));

  })

  return {  options, documents, isLoading, ...setupFunctions };
}

async function getAllOrgTypes(options){
    const opts            = unref(options);
    const promisesForData = [ getData('govTypes'), getData('orgTypes') ];
    const data            = await Promise.all(promisesForData);
    const allOrgTypes     = [ ...additionalOptions, ...data[0], ...data[1] ];
    const filterKeys      = opts.order.map(({ identifier })=>identifier);


    return allOrgTypes.filter(({ identifier }) => !filterKeys.includes(identifier)).map(({ identifier })=>identifier);
}

function loadCOuntriesNames(docs){
  const documents = unref(docs);

  for (let index = 0; index < documents.length; index++) {
    const doc = documents[index];

    if(doc?.creator?.worksFor?.country?.identifier)
      lookUp('all', [doc.creator.worksFor.country.identifier], true).then((c)=>doc.creator.worksFor.country=c);

      lookUp('all', [doc.type.identifier], true).then((c)=>{
        if(c){
          doc.typeName=c.name;
        }else{
          const custom = additionalOptions.find(({ identifier } ={})=> identifier===doc?.type?.identifier);

          if(custom)  doc.typeName = custom.name;
        }
      })
  }

  return documents;
}

</script>
