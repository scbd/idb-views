<template>
  <ChmComponent :options="options"  id="idb-views"/>
</template>

<script>
import '@/style.scss';

import ChmComponent from '@/components/index.vue';

export default {
  name      : 'App',
  props     : { options   : { type: Object } },
  components: { ChmComponent }
}
</script>


