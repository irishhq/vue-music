<template>
  <transition name="slide">
    <div class="singer-detail">
      歌手详情...
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERROR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getSongVkey } from 'api/song'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      getSingerDetail(this.singer.id).then(res => {
        console.log(res)
        this._formatSongs(res.data.list)
      })
    },
    _formatSongs(list) {
      let result = []
      list.forEach((item) => {
        // console.log('item',item)
        // 解构赋值-拿到item 下的 musicData 列表数据
        let {musicData} = item
        // 更新-加上vkey
        getSongVkey(musicData.songmid).then(res => {
          const vkey = res.data.items[0].vkey;
          if (musicData.songid && musicData.albummid) {
            result.push(createSong(musicData, vkey))
          }
        })
        console.log('musicData', musicData)
        // if(musicData.songid && musicData.albummid){
        //   result.push(CreatSong(musicData))
        // }
      })
      return result
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
