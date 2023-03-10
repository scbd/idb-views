<template >
    <div ref="idbMessage">
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
                        <div v-if="doc?.image?.contentUrl" class="col-12 col-sm-3 col-md-3 col-lg-3 p-0"> 
                            <img :src="doc.image.contentUrl" class="img-thumbnail border-top-0 float-left p-0 m-0" :alt="t(doc.image.caption)" style="border: 0px ;">
                        </div>

                        <div class="col-12 col-sm-9 col-md-9 col-lg-9"> 
                        <a v-if="options.editUrl && isAdmin" :href="`${options.editUrl}?identifier=${doc._id}`" target="_blank"  rel="noopener noreferrer">
                            <Icon name="edit" class="float-right"/>
                        </a>
                        <h3 v-if="doc.name && doc.type.identifier=='headliner'" class="headliner-name">{{ t(doc.name) }}</h3>
                        <h5 v-if="doc.type.identifier=='cop-presidencies'" class="cop">
                            <span v-if="doc.name.en">{{ t(doc.name) }}: {{doc.creator.worksFor.country.name}}</span>
                            <span v-if="!doc.name.en">{{ t('COP Presidency') }}: {{doc.creator.worksFor.country.name}}</span>
                            <img :src="doc.creator.worksFor.country.image" class="img-thumbnail border-top-0 float-right" :alt="doc.creator.worksFor.country.name" style="border: 0px; max-height:30px">
                        </h5>
                        <h5 v-if="doc.type.identifier=='8830904C-8AF4-4C2F-AADB-363D98D854DA'" class="cop">
                            <span>{{doc.creator.worksFor.country.name}}</span>
                            <img :src="doc.creator.worksFor.country.image" class="img-thumbnail border-top-0 float-right" :alt="doc.creator.worksFor.country.name" style="border: 0px; max-height:30px">
                        </h5>
                        <h5 v-if="!nonOrgs.includes(doc.type.identifier)" class="cop">
                            <span>{{ t(doc.creator.worksFor.name) }}</span>
                        </h5>
                        <p class="card-text cbd-text">{{ t(doc.creator.name) }}, <span v-if="doc?.creator?.jobTitle">{{ t(doc.creator.jobTitle) }}</span></p>

                        <p v-if="doc.commentText" class="card-text cbd-text">{{ t(doc.commentText) }}</p>

                        <p>
                            <span v-for="(attachment,index) in doc.attachments" v-bind:key="index">
                                <a v-if="attachment.contentUrl" :href="attachment.contentUrl" target="_blank"  rel="noopener noreferrer">
                                <span v-if="attachment.name">{{ t(attachment.name) }}</span>
                                <span v-if="attachment.caption">{{ t(attachment.caption) }}</span>
                                </a>
                                <span v-if="index !== doc.attachments.length-1">&nbsp; | &nbsp;</span>
                            </span>
                        </p>
                        
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="hasSlots" class="card-footer">
                <div class="row">
                    <div class="col-12">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>

            <!-- hack css not rendering in slot bug -->
            <div v-show="false" class="btn-group btn-group-sm" role="group" >
                <a  class="btn btn-primary btn-sm" href="#" type="button" target="_blank">  </a> 
                <button  type="button" class="btn btn-outline-dark btn-sm"> </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { toRef  } from 'vue-demi';
    import   isAdmin  from '@/composables/is-admin.js';
    import   t        from '@/composables/i18n.js';
    import   Icon     from '@/components/Icon.vue';

    export default {
        name      : 'IdbMessage',
        components: { Icon },
        props     : {   options  : { type: Object, required: true },
                        document : { type: Object, required: true },
                        hasSlots : { type: Boolean, default: () => false }
                    },
        setup
    }

    function setup(props){
        const   doc            = toRef(props, 'document');
        const   hasSlots       = toRef(props, 'hasSlots');
        const   options        = toRef(props, 'options');
        const   setUpFunctions = { t,  isAdmin };
        const   nonOrgs        = [ 'headliner', '8830904C-8AF4-4C2F-AADB-363D98D854DA', 'cop-presidencies' ];

        return { doc, hasSlots, options, nonOrgs,  ...setUpFunctions };
    }
</script>