<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots"></div>
  </div>
</template>
<script>
// import BetterScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 3000
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this._setSliderWidth()
    this._initSlider()
  },
  methods: {
    _setSliderWidth() {
      let children = this.$refs.sliderGroup.children
      let sliderWidth = this.$refs.slider.clientWidth
      // let width = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        console.log('=========')
        addClass(child, 'slider-item')
        child.style.width = sliderWidth
        // width += sliderWidth
      }
      // this.$refs.sliderGroup.style.width = width + 'px'
      // console.log(this.$refs.sliderGroup.style.width)
    },
    _initSlider() {}
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>