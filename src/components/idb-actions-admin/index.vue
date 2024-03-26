<template >
  <div ref="idbActionsAdmin">
    <Loading v-if="isLoading"/>
    <AuthNeeded :options="options"/>
    <div v-if="isAdmin">
      {{ t('Filter') }}:
      <select @change="onChangeFilter($event)" v-model="filter" class="custom-select">
        <option value="request" selected>{{ t('New') }}</option>
        <option value="">{{ t('All') }}</option>
        <option value="rejected">{{ t('Rejected') }}</option>
        <option value="published">{{ t('Published') }}</option>
      </select>
      Year: 
      <select @change="onChangeFilter($event)" v-model="selectedYear" class="custom-select">
        <option v-for="y in years" v-bind:key="y" :value="y">{{ y }}</option>
      </select>
    </div>
    <hr/>
    <div v-if="isAdmin" >
      <div v-for="(doc,index) in documents" v-bind:key="index">
        <Action :has-slots="true" :document="doc" :options="options" >

          <template v-slot:header>
              <div class="text-center">
                <span v-if="doc.meta.status==='published'" class="badge badge-success float-right">{{ t('Published') }} </span>
                <span v-if="doc.meta.status==='rejected'" class="badge badge-warning float-right">{{ t('Rejected') }}</span>
                <span v-if="doc.meta.status==='request'" class="badge badge-error float-right">{{ t('New') }}</span>
                <span v-if="doc.meta.status==='unpublished'" class="badge badge-error float-right">{{ t('Unpublished') }}</span>
              </div>

              <span class="text-muted small">{{ t('Created') }}&nbsp;: {{metaFormat(doc.meta?.createdOn)}}</span><br/>
              <span class="text-muted small">{{ t('Updated') }}: {{metaFormat(doc.meta?.updatedOn)}}</span><br/>
              <span v-if="!doc.isGlobal?.identifier" class="text-muted small">{{ t('Country') }}&nbsp;: {{doc.address?.country?.name}}</span>
              <span v-if="doc.isGlobal?.identifier" class="text-muted small">{{ t('Country') }}&nbsp;: {{ t('Global') }}</span><br/>
          </template>

          <template v-slot:footer>
            <div  role="group" class="btn-group">
                  <a  class="btn btn-primary btn-sm" :href="`${options.editUrl}?identifier=${doc._id}`" type="button" target="_blank"> {{ t('Edit') }}</a> 
                  <button v-on:click="changeStatus('publish', doc._id)" v-if="doc.meta.status!=='published'" type="button" class="btn btn-outline-dark btn-sm">{{ t('Publish') }}</button>
                  <button v-on:click="changeStatus('unpublish', doc._id)" v-if="doc.meta.status!=='unpublished'"     type="button" class="btn btn-outline-dark btn-sm">{{ t('Unpublish') }}</button> 
                  <button v-on:click="changeStatus('reject', doc._id)" v-if="doc.meta.status!=='rejected'"  type="button" class="btn btn-outline-dark btn-sm">{{ t('Reject') }}</button>
            </div>
          </template>

        </Action>

      </div>
    </div>
    <hr/>
  </div>
</template>

<script>
import { toRef         , ref , unref } from 'vue';
import { listDocuments , postStatus  } from '@/composables/api.js';
import { dtFormat      , metaFormat  } from '@/composables/date-formats.js';
import { lookUp                      } from '@scbd-chm/cached-apis';

import   Loading      from '@/components/Loading.vue';
import   Action       from '@/components/action.vue';
import   AuthNeeded   from '@/components/authorization-needed.vue';
import   isAdmin, {isAdminFunction}      from '@/composables/is-admin.js';
import   t            from '@/composables/i18n.js';

export default {
  name      : 'IdbActionsAdmin',
  components: { Action, Loading, AuthNeeded },
  props     : { options : { type: Object, required: true } },
  setup,mounted
}

function setup(props){
  const   isLoading      = ref(true);
  const   filter         = ref('request');
  const   selectedYear   = ref(new Date().getFullYear());
  const   years          = ref([]);
  const   documents      = ref([]);
  const   options        = toRef(props, 'options');
  const   setUpFunctions = { t, onChangeFilter, changeStatus, isAdmin, dtFormat, metaFormat };
  isAdminFunction()
  for (let year = new Date().getFullYear(); year>=2023 ; year--)
    years.value.push(year);

  getActions(filter, selectedYear).then((responseDocs)=> { 
    documents.value = responseDocs;
    setTimeout(() => {isLoading.value = false }, 1000);
  });

  return { years, selectedYear, options, documents, filter, isLoading, ...setUpFunctions };
}

function onChangeFilter(){
  this.isLoading = true;
  getActions(this.filter, this.selectedYear).then((responseDocs)=>  { 
    this.documents = responseDocs;
    setTimeout(() => { this.isLoading = false }, 500);
  });
}

async function changeStatus(identifier, status){
  this.isLoading = true;
  this.documents = [];
  await postStatus(identifier, status);

  const value = this.filter? this.filter : { $ne: 'x'};
  const q     = { 'meta.status': value  };

  this.documents = await getActions(this.filter, this.selectedYear);
  setTimeout(() => { this.isLoading = false }, 500);
}

async function getActions(filterSelection, selectedYear){
  const filterValue                   = unref(filterSelection);
  const filter                        = filterValue? { 'meta.status': filterValue } : {'meta.status': {$ne: 'x'}};
  const allDocuments                  = await loadCountriesNames(await listDocuments(filter,{},unref(selectedYear)));

  return allDocuments;
}

async function loadCountriesNames(docs){
  const documents = unref(docs);

  for (let index = 0; index < documents.length; index++) {
    const doc = documents[index];

    if(doc?.address?.country?.identifier)
      doc.address.country = await lookUp('countries', [doc?.address?.country?.identifier], true);
  }

  return documents;
}
function mounted(){
  

  setTimeout(() => {
    isAdminFunction();
    this.onChangeFilter()
  }, 500);
}
</script>


