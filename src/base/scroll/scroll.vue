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
    }
  },

  mounted() {
    this.initScroll()
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
        click: this.click
      }
      this.scroll = new BScroll(this.$refs['scroll-wrapper'], options)
    },
    /* https://github.com/ustbhuangyi/better-scroll/blob/v1/example/components/scroll/scroll.vue */
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>
<style lang="stylus">

</style>