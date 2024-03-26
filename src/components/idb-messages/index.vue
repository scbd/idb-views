<template >
  <div  ref="idbMessages">
    <Loading v-if="isLoading"/>
    <div v-for="({type, docs},index) in documents" v-bind:key="index">

      <hr v-if="type!='headliner' && docs?.length"/>
      <h2 :id="`type-${type}`" v-if="type!='headliner' && docs?.length" class="type-header"> {{t('Messages from')}} {{t(type)}}  </h2>
      <hr v-if="type!='headliner' && docs?.length"/>

      <div v-for="(doc,index) in docs" v-bind:key="index">
        <Message :document="doc" :options="options" />
      </div>
      
    </div>
  </div>
</template>

<script>
  import { toRef, ref, unref } from 'vue';
  import { listDocuments     } from '@/composables/api.js';
  import { lookUp            } from '@scbd-chm/cached-apis';
  import   Icon                from '../Icon.vue';
  import   t                   from '@/composables/i18n.js';
  import   isAdmin             from '@/composables/is-admin.js';
  import   Message             from '@/components/message.vue';
  import   Loading             from '@/components/Loading.vue';

  export default {
    name      : 'IdbMessages',
    components: { Icon, Message, Loading },
    props     : { options : { type: Object, required: true } },
    setup
  }

  function setup(props){  
    const   isLoading      = ref(true);
    const   documents      = ref([]);
    const   options        = toRef(props, 'options');
    const   setupFunctions = { t, isAdmin, getMessages };

    getMessages(options).then(async (responseDocs)=>{
      documents.value = responseDocs;
      setTimeout(() => {isLoading.value = !isLoading.value }, 1000);

      return documents;
    })

    return { options, documents, isLoading, ...setupFunctions };
  }

  function loadCountriesNames(docs){
    const documents = unref(docs);

    for (let index = 0; index < documents.length; index++) {
      const doc = documents[index];

      if(doc?.creator?.worksFor?.country?.identifier)
        lookUp('countries', [ doc.creator.worksFor.country.identifier ], true).then( (c)=> doc.creator.worksFor.country = c);
    }

    return documents;
  }

  async function getMessages(options){ 
      const   typeDocumentMap = [];
      const { order }         = unref(options);
      const   typeIdentifiers = order.map(({ identifier })=>identifier);
      const   allDocs         = loadCountriesNames(await listDocuments({ 'type.identifier' : { $in: typeIdentifiers} }));


      for (const { identifier:type } of order) {
        const typeSet = { type, docs: [] };

        for (let index = 0; index < allDocs.length; index++) {
          const doc = allDocs[index];

          if(type !== doc.type.identifier) continue;

          typeSet.docs.push(doc);
        }

        typeDocumentMap.push(typeSet);
      }

      return typeDocumentMap;
  }
</script>