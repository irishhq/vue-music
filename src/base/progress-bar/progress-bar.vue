<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from 'common/js/dom'
const progressBtnWidth = 16 /* 与css中样式相关 */
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initialled) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  created() {
    this.touch = {} /* 由touch三个事件共同维护 */
  },
  methods: {
    progressTouchStart(e) {
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
      this.touch.initialled = true
    },
    progressTouchMove(e) {
      if (!this.touch.initialled) {
        return
      }
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetX = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetX)
    },
    progressTouchEnd(e) {
      this.touch.initialled = false
      this._triggerPercent() /* 向父组件传递移动后的百分比值 */
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChanged', percent)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.progress-bar {
  height: 30px
  margin: 0 5px
  .bar-inner {
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)

    .progress {
      position: absolute
      height: 100%
      background: $color-theme
    }

    .progress-btn-wrapper {
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px

      .progress-btn {
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
      }
    }
  }
}
</style>