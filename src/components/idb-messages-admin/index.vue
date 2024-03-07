<template >
  <div ref="idbMessagesAdmin">
    <Loading v-if="isLoading"/>
    <AuthNeeded :options="options"/>
    
    <div v-show="isAdmin">
      Filter: 
      <select @change="onChangeFilter($event)" v-model="filter" class="custom-select">
        <option value="request" selected>{{ t('New') }}</option>
        <option value="">{{ t('All') }}</option>
        <option value="rejected">{{ t('Rejected') }}</option>
        <option value="published">{{ t('Published') }} </option>
        <option value="unpublished">{{ t('Unpublished') }}</option>
      </select>
    </div>
    <hr/>
    <div v-if="isAdmin" >
      <div v-for="(doc,index) in documents" v-bind:key="index">

          <Message :document="doc" :options="options" :has-slots="true">
            <template v-slot:header>
                <div class="text-center">
                  <span v-if="doc.meta.status==='published'" class="badge badge-success ">{{ t('Published') }} </span>
                  <span v-if="doc.meta.status==='rejected'" class="badge badge-warning ">{{ t('Rejected') }}</span>
                  <span v-if="doc.meta.status==='request'" class="badge badge-error">{{ t('New') }}</span>
                  <span v-if="doc.meta.status==='unpublished'" class="badge badge-error">{{ t('Unpublished') }}</span>
                </div>

                <span class="text-muted small">{{ t('Created') }}&nbsp;: {{metaFormat(doc.meta?.createdOn)}}</span><br/>
                <span class="text-muted small">{{ t('Updated') }}: {{metaFormat(doc.meta?.updatedOn)}}</span><br/>
                <span class="text-muted small">{{ t('Type') }}: {{doc.typeName}}</span>
            </template>

            <template v-slot:footer>
              <div class="btn-group btn-group-sm" role="group" >
                <a  class="btn btn-primary btn-sm" :href="`${options.editUrl}?identifier=${doc._id}`" type="button" target="_blank"> {{ t('Edit') }}</a> 
                <button v-on:click="changeStatus('publish', doc._id)" v-if="doc.meta.status!=='published'" type="button" class="btn btn-outline-dark btn-sm">{{ t('Publish') }}</button>
                <button v-on:click="changeStatus('unpublish', doc._id)" v-if="doc.meta.status!=='unpublished'"     type="button" class="btn btn-outline-dark btn-sm">{{ t('Unpublish') }}</button> 
                <button v-on:click="changeStatus('reject', doc._id)" v-if="doc.meta.status!=='rejected'"  type="button" class="btn btn-outline-dark btn-sm">{{ t('Reject') }}</button>
              </div>
            </template>
          </Message>

      </div>
    </div>
    <hr/>
  </div>
</template>

<script>
import { toRef        , ref, unref } from 'vue';
import { listDocuments, postStatus } from '@/composables/api.js';
import { lookUp                    } from '@scbd-chm/cached-apis';
import { metaFormat                } from '@/composables/date-formats.js';

import Icon       from '../Icon.vue';
import Message    from '@/components/message.vue';
import AuthNeeded from '@/components/authorization-needed.vue';
import isAdmin    from '@/composables/is-admin.js';
import t          from '@/composables/i18n.js';
import Loading    from '@/components/Loading.vue';

export default {
  name      : 'IdbMessagesAdmin',
  components: { Icon,  Message, Loading, AuthNeeded },
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
  const   filter         = ref('request');
  const   documents      = ref([]);
  const   options        = toRef(props, 'options');
  const   setupFunctions = { t, metaFormat, isAdmin, onChangeFilter, changeStatus };
  const   nonOrgs        = [ 'headliner', '8830904C-8AF4-4C2F-AADB-363D98D854DA', 'cop-presidencies' ];

  listDocuments({ 'meta.status': 'request'}).then(async (responseDocs)=>{
    documents.value = responseDocs;

    return documents;
  }).then(loadCOuntriesNames)
    .then(() => setTimeout(() => {isLoading.value = !isLoading.value }, 1000));

  return { options, documents, nonOrgs, filter, isLoading, ...setupFunctions };
}

function onChangeFilter($event){
  this.isLoading = true;
  this.documents = [];
  const value    = $event?.target?.value? $event.target.value : { $ne: 'x'};
  const q        = { 'meta.status': value  };

  listDocuments(q).then(async (responseDocs)=>{
      this.documents = responseDocs;

      return this.documents;
    }).then(loadCOuntriesNames)
    .then(()=> setTimeout(() => { this.isLoading = !this.isLoading }, 500));
}

async function changeStatus(identifier, status){
  this.isLoading = true
  this.documents = []

  const resp  = await postStatus(identifier, status)
  const value = this.filter? this.filter : { $ne: 'x'}
  const q     = { 'meta.status': value }

  listDocuments(q).then(async (responseDocs)=>{
      this.documents = responseDocs

      return this.documents
  }).then(loadCOuntriesNames).then(()=> setTimeout(() => { this.isLoading = !this.isLoading }, 500));
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

          if(custom)  doc.typeName = custom.name
        }
      })
  }

  return documents;
}
</script>
