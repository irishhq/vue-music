<template>
  <div ref="scroll-wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'/* better-scroll v1 */
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  watch: {
    data(val) {
      this.refresh()
    }
  },
  methods: {
    initScroll() {
      if (!this.$refs['scroll-wrapper']) {
        return
      }
      let options = {
        probeType: this.probeType,
        click: this.click,
        mouseWheel: true,
        disableMouse: false,
        disableTouch: false
      }
      this.scroll = new BScroll(this.$refs['scroll-wrapper'], options)

      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
    },
    /* https://github.com/ustbhuangyi/better-scroll/blob/v1/example/components/scroll/scroll.vue */
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>
<style lang="stylus">

</style>