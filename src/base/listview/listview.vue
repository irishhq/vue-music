<template>
  <scroll class="listview" ref="listview" @scroll="_scroll" :listenScroll="listenScroll" :probeType='probeType'>
    <ul>
      <li class="list-group" v-for="group in data" :key='group.title' ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items" :key="item.id">
            <img class="avatar" v-lazy="item.avator">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul class="list-shortcut">
        <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle.length" ref="listFixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import { getDataAttr } from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      listenScroll: false,
      scrollY: -1,
      currentIndex: 0,
      diff: 0 /* 当前上限与滚动位置的差值 */
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortCutTouchStart(e) {
      let anchorIndex = getDataAttr(e, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortCutTouchMove(el) {
      let moveTouch = el.touches[0]
      let delta = parseInt(moveTouch.pageY - this.touch.y1) / ANCHOR_HEIGHT | 0
      /**
       * 位运算符‘|0’: js内部的类型自动转换，js数值都是由64位浮点型表示的，当进行位运算的时候，会自动转换为32为有符号的整数，并舍弃小数位。所以就可以实现向下取整
       * typeof (this.touch.anchorIndex): string
       * typeof (delta): number
       */
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta /* 修复字母索引不能正确滚动 */
      this._scrollTo(anchorIndex)
    },
    _scrollTo(anchorIndex) {
      this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
    },
    _scroll(pos) {
      this.scrollY = pos.y
    },
    _calculateHeight() { /* 私有 */
      let height = 0
      this.listHeight = []
      this.listHeight.push(height)
      const listgroup = this.$refs.listgroup
      for (let i = 0; i < listgroup.length; i++) {
        const item = listgroup[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      /* 滚动到顶端 */
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      /* 在中间部分滚动 */
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        const heightLow = listHeight[i]
        const heightUp = listHeight[i + 1]
        if (-newY < heightUp && -newY >= heightLow) {
          this.currentIndex = i
          this.diff = heightUp + newY
          return
        }
      }
      /* 当滚动到底部，且-newY大于最后一个元素的上限 */
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let translateY = (newVal > 0 && newVal - TITLE_HEIGHT < 0) ? newVal - TITLE_HEIGHT : 0
      if (this.translateY === translateY) { /* 为0时，减少重复渲染 */
        return
      }
      this.translateY = translateY
      this.$refs.listFixed.style.transform = `translate3d(0, ${translateY}px, 0)`
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
