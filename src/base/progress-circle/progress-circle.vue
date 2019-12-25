<template>
  <svg :width="radius" :height="radius" viewBox="0,0,100,100">
    <circle cx="50" cy="50" r="50" fill="transparent"></circle>
    <circle cx="50" cy="50" r="50" fill="blue"></circle>
  </svg>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 50
    }
  }
};
</script>
