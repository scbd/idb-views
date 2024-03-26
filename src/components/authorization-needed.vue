<template >
    <div ref="AuthorizationNeeded">
        <div  v-if="!isAdmin"  class="alert alert-warning fade show" role="alert" >
            <h5 >{{ t('You do not have authorization to access administration') }}</h5>
            <p v-if="options?.accountsUrl">{{ t('Please login at') }} <a :href="`${options?.accountsUrl}/signin?returnUrl=${returnUrl}`">{{options?.accountsUrl}}</a></p>
        </div>
    </div>
</template>

<script>
import { toRef, ref } from 'vue';
import { isServer } from '@/composables/ssr.js';
import   isAdmin   from '@/composables/is-admin.js';
import   t         from '@/composables/i18n.js';


export default {
    name      : 'AuthorizationNeeded',
    props     : { options : { type: Object, required: true } },
    setup, mounted
}

function setup(props){
    const   returnUrl      = ref('');
    const   options        = toRef(props, 'options');
    const   setUpFunctions = { t, isAdmin };

    return { options, returnUrl, ...setUpFunctions };
}

function mounted(){
    if(isServer() && !window?.location?.href) return;

    this.returnUrl = encodeURIComponent(window.location.href);
}
</script>