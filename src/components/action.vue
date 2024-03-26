<template >
    <div ref="idbAction" :id="doc._id">
        <div class="card card-row mb-5">
            <div v-if="hasSlots" class="card-header">
                <div class="row"> 
                    <div class="col-12"> 
                        <slot name="header"></slot>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                    <a v-if="options.editUrl && isAdmin" :href="`${options.editUrl}?identifier=${doc._id}`" target="_blank"  rel="noopener noreferrer">
                        <Icon name="edit" class="float-right"/>
                    </a>
                    <p class="cbd-text">{{ dtFormat(doc) }}<span v-if="doc?.address?.locality" >, {{ t(doc?.address?.locality) }}</span></p>

                    <h3 v-if="doc.name" class="headliner-name">{{ t(doc.name) }}</h3>
                    </div>
                    <div v-if="doc?.image?.contentUrl" class="col-12"> 
                    <img :src="doc.image.contentUrl" class="img-thumbnail border-top-0  p-0" :alt="t(doc.image.caption)" style="border: 0px; margin-bottom: 20px; width:100%">
                    </div>

                    <div class="col-12"> 

                    <p class="cbd-text">{{ t(doc.description) }}</p>
                    <p>
                        <span v-for="(attachment,index) in doc.attachments" v-bind:key="index">
                            <a v-if="attachment.contentUrl" :href="attachment.contentUrl" target="_blank"  rel="noopener noreferrer">
                            <span v-if="attachment.name">{{ t(attachment.name) }}</span>
                            <span v-if="attachment.caption">{{ t(attachment.caption) }}</span>
                            </a>
                            <span v-if="index !== doc.attachments.length-1">&nbsp; | &nbsp;</span>
                        </span>
                    </p>
                    <p class="cbd-text">{{ t('Contact') }}: <Icon name="email" /> <a :href="`mailto:${doc.creator?.email}`">{{ t(doc.creator?.worksFor?.name)}}</a> <span v-if="doc.address?.hasMap?.contentUrl">| <Icon name="map" /><a :href="doc.address?.hasMap?.contentUrl" target="_blank" rel="noopener noreferrer">{{ t(doc.address?.hasMap?.name) }}</a></span> </p>
                    </div>
                </div>
                </div>
            </div>
            
            <!-- hack css not rendering in slot bug -->
            <div v-show="false" class="btn-group btn-group-sm" role="group" >
                    <a  class="btn btn-primary btn-sm" href="#" type="button" target="_blank">  </a> 
                    <button  type="button" class="btn btn-outline-dark btn-sm"> </button>
            </div>

            <div v-if="hasSlots" class="card-footer">
                <div class="row">
                    <div class="col-12">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toRef    } from 'vue-demi';
import { dtFormat } from '@/composables/date-formats.js';
import   Icon       from './Icon.vue';
import   isAdmin    from '@/composables/is-admin.js';
import   t          from '@/composables/i18n.js';

export default {
    name      : 'IdbAction',
    components: { Icon },
    props     : {   options : { type: Object, required: true },
                    document : { type: Object, required: true },
                    hasSlots : { type: Boolean, default: () => false }
                },
    setup
}

function setup(props){
    const   doc            = toRef(props, 'document');
    const   hasSlots       = toRef(props, 'hasSlots');
    const   options        = toRef(props, 'options');
    const   setUpFunctions = { t,  dtFormat, isAdmin };

    return { doc, hasSlots, options,  ...setUpFunctions };
}

</script>