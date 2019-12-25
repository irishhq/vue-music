<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-background"></circle>
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-bar" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 50
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashArray() {
      return (Math.PI * 2 * 50)
    },
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
};
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .progress-circle
    position relative
    circle
      stroke-width 7px
      // stroke-width表示环形的宽度
      transform-origin center
      // 中心旋转
      &.progress-background
        transform scale(0.9)
        stroke $color-theme-d
        opacity 0.1
      &.progress-bar
        transform scale(0.9) rotate(-90deg)
        stroke $color-theme
</style>