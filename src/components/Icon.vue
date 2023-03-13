<template >
  <svg class="chm-icon" :class="{ [`chm-icon-${name}`]:true }"  >
    <use  v-bind="{ 'xlink:href': `#chm-icon-${name}` }"></use>
  </svg>
</template>
<script>
export default {
  name : 'Icon',
// #region snippet
  props : { name : { type: String, required: true } }
// #endregion snippet
}
</script>
