import { defineStore } from 'pinia'      ;
import { pascalCase  } from "pascal-case";

const views             = [ 'IdbMessages', 'IdbMessagesAdmin','IdbActions', 'IdbActionsAdmin', 'IdbMessagesCommunity', 'IdbActionsCountries' ]
const yearRequiredViews = [ 'IdbMessages','IdbMessagesAdmin', 'IdbActions', 'IdbActionsAdmin', 'IdbMessagesCommunity', 'IdbActionsCountries' ]
const actions           = { loadOptions }
const apiPathMap        = {
                            'IdbMessages'          : '/v2023/idb/messages',
                            'IdbMessagesCommunity' : '/v2023/idb/messages',
                            'IdbMessagesAdmin'     : '/v2023/idb/messages',
                            'IdbActionsAdmin'      : '/v2023/idb/actions' ,
                            'IdbActions'           : '/v2023/idb/actions' ,
                            'IdbActionsCountries'  : '/v2023/idb/actions'
                          }

export const useOptionsStore = defineStore('options', { state, actions })

const initState = { 
  view        : '',
  baseApiUrl  : 'https://api.cbd.int/api',
  baseApiPath : '',
  apiUrl      : '',
  accountsUrl : 'https://accounts.cbd.int',
  editUrl     : '',
  countryBaseUrl:'https://rjh.bioland.cbddev.xyz/biodiversity-day/celebrations',
  year        : new Date().getFullYear(),
  debug       : false,
  country     : '',
  order       : []
}

function state(){ return initState }

async function loadOptions(options = {}){

  const { view: rawView, year } = options.value;
  const   view                  = rawView? pascalCase(rawView) : rawView;
  const   apiUrl                = getApiUrl({ ...options.value, view }, this);
  const   id                    = makeId({ ...options.value, view });

  if(!views.includes(view))                     throw new Error(`IdbViews: Error unknown view passed in options "${view}"`);
  // if(yearRequiredViews.includes(view) && !year) throw new Error(`IdbViews: Error year is required to be passed in widget options for view: "${view}"`);

  this.$patch({ ...options.value, view, apiUrl, id } );

  return this;
}

function getApiUrl({ apiUrl, baseApiUrl, baseApiPath, view }, state){
  if(apiUrl) return apiUrl;
  
  const baseRaw = baseApiUrl ? baseApiUrl  : state.baseApiUrl;
  const base    = baseRaw.endsWith('/')? baseRaw.slice(0, -1) : baseRaw;
  const path    = baseApiPath? baseApiPath : apiPathMap[view];

  return `${base}${path}`;
}

function makeId({ id, year, view } ){
  return id? id : pascalCase(`IdbViews${view}${year}`);
}