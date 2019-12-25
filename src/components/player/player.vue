<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @afterLeave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="minimizePlayer">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChanged="onProgressBarChanged"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="maximizePlayer">
        <div class="icon">
          <img :class="cdClass" :src="currentSong.image" alt="" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <Progress-Circle :radius="radius" :percent="percent">
            <i :class="miniIcon" @click.stop="togglePlaying" class="icon-mini"></i>
          </Progress-Circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="songUrl" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import { getSong } from 'api/song'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'

import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'

const transform = prefixStyle('transform')
export default {
  data() {
    return {
      songUrl: '', /* 歌曲地址 */
      songReady: false,
      currentTime: 0,
      duration: 0,
      percent: 0,
      radius: 32 /*  */
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ]),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass() {
      return this.songReady ? '' : 'disable'
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (!newVal.id) {
        return
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this._getSong(newVal.id)
    },
    songUrl(newVal) {
      /* 获取音乐总时长 */
      let stop = setInterval(() => {
        /* 手动不断读取audio的时长 */
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(stop)
        }
      }, 150)
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing(newPlaying) { /* 播放状态 */
      const audio = this.$refs.audio
      // this.$nextTick(() => {
      //   newPlaying ? audio.play() : audio.pause()
      // })
      // 定时未清除
      let timer = setTimeout(() => {
        newPlaying ? audio.play() : audio.pause()
      }, 1000)
    },
    currentTime(newVal) {
      /* 监测当前播放时间，以改变进度条变量percent */
      this.percent = newVal / this.duration
    }
  },
  methods: {
    jump() {
      /* 测试chrome preserveLog */
      getSingerList().then((res) => {
        if (res.status === ERR_OK) {
          alert('hello')
          window.onunload = function() { debugger; }
          window.location.href = 'https://www.baidu.com/'
        }
      })
    },
    /* 最大最小化播放器 */
    minimizePlayer() {
      this.setFullScreen(false)
    },
    maximizePlayer() {
      this.setFullScreen(true)
    },
    /* 动画效果实现 */
    enter(el, done) {
      let {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` /* 小CD图标位置 */
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'moveCD',
        animation,
        presets: {
          duration: 600,
          easing: 'ease'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'moveCD', done)
    },
    afterEnter() {
      animations.unregisterAnimation('moveCD')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      /* 清空动效，再次打开位置无误 */
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    /* 暂停&播放 */
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    /* 播放前一首 */
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying(true)
      }
      this.songReady = false
    },
    /* 播放下一首 */
    next() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying(true)
      }
      this.songReady = false
    },
    /* 歌曲是否为可播放状态 */
    ready() {
      this.songReady = true
    },
    error() { /* error 事件在音频/视频(audio/video)加载发生错误时触发,songReady仅控制连点操作 */
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime /*  需格式化时间戳 */
    },
    /* 拖拽后更新播放进度条 */
    onProgressBarChanged(percent) {
      this.$refs.audio.currentTime = this.duration * percent
      if (!this.playing) {
        this.setPlayingState(true)
      }
    },
    /**
     * @description 时间格式化
     * @param interval 时间戳
     */
    format(interval) {
      interval = interval | 0 /* 向下取整 */
      const minute = this._pad(interval / 60 | 0)
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    /* 时间补零 */
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale() {
      /* 以中心点为基准 */
      const targetWidth = 40
      const paddingLeft = 20 /* mini-player */
      const paddingTop = 80 /* normal-play */
      const paddingBottom = 10
      const cdWidth = window.innerWidth * 0.8
      const scale = targetWidth / cdWidth
      const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2)
      const y = window.innerHeight - paddingTop - (cdWidth / 2) - paddingBottom
      return {x, y, scale}
    },
    /* 获取歌曲播放地址 */
    _getSong(id) {
      getSong(id).then((res) => {
        this.songUrl = res.data.data[0].url
      })
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
        img
          width: 100%
          height: 100%
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused  /* 暂停动画 */
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        transform: translate3d(0, -100px, 0)
        .top
          // transform: translate3d(0, -100px, 0)
        .bottom
          // transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
        transform: translate3d(0, 100px, 0)
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>