<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{ active: currentPageIndex === index }"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'/* better-scroll v1 */
import { addClass } from 'common/js/dom'
export default {
  name: 'slider',
  data() {
    return {
      dots: {
        type: Array,
        default: []
      },
      currentPageIndex: 0 /* 设置当前页dot效果 */
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this._setSliderWidth()
    this._initDots() /* 调用在初始化slider前 */
    this._initSlider()
    /* if (this.autoplay) {
      this._play()
    } */
  },
  methods: {
    _setSliderWidth() {
      let children = this.$refs.sliderGroup.children
      let sliderWidth = this.$refs.slider.clientWidth
      let width = 0; /* total width */
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth /* 实现无缝轮播 */
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, // 循环
          threshold: 0.3,
          speed: 400 // 轮播间隔
        }
      })
      /* 基础参数 https://github.com/ustbhuangyi/better-scroll/tree/v1/doc/zh-hans */
      /* slide参数 https://github.com/ustbhuangyi/better-scroll/blob/v1/example/components/slide/slide.vue */
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX + 1/* 返回值：{Object} { x: posX, y: posY,pageX: x, pageY: y} */
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        /* if (this.autoPlay) {
          this._play()
        } */
      })
    },
    _initDots() {
      this.dots = new Array(this.$refs.sliderGroup.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex
      if (this.loop) {
        pageIndex += 1
      }
      setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
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