<template>
  <div id="singerPage" class="singer">
    <Listview v-bind:data="singers" @select="selectSinger" v-show="this.$route.path==='/singer'"></Listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Listview from 'base/listview/listview'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
const pinyin = require('pinyin')
const HOT_TITLE = '热门'
const HOT_LEN = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  components: {
    Listview
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.status === ERR_OK) {
          let list = res.data.artists
          list.map(item => {
            let firstLetterArr = pinyin(item.name[0], {
              style: pinyin.STYLE_FIRST_LETTER
            })
            item.firstLetter = firstLetterArr[0][0].toUpperCase()
          })
          this.singers = this.normalizeSingers(list || [])
        }
      })
    },
    normalizeSingers(list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        },
        other: {
          title: '#',
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push(new Singer(item.id, item.name, item.img1v1Url, item.alias.join(' / ')))
        }
        let key = item.firstLetter
        if (key.match(/[a-zA-Z]/)) {
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer(item.id, item.name, item.img1v1Url, item.alias[0]))
        } else {
          map.other.items.push(new Singer(item.id, item.name, item.img1v1Url, item.alias[0]))
        }
      })
      /* 数据排序,展示有序列表 */
      let hot = [] /* 热门 */
      let letter = [] /* 字母 */
      let other = [] /* 其他字符 */
      Object.keys(map).forEach(key => { /* for...in效率低 */
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          letter.push(val)
        } else if (val.title === HOT_TITLE) {
          hot.push(val)
        } else {
          other.push(val)
        }
      })
      letter.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      letter.unshift.apply(letter, hot) /* concat内存开销大;大数组合并小数组，减少数组元素操作次数 */
      letter.push.apply(letter, other)
      return letter
    },
    /* 工具函数会将store中的state映射到局部计算属性中 */
    ...mapMutations({
      setSinger: 'SET_SINGER' // 传字符串参数 'SET_SINGER' 等同于 `state => state.SET_SINGER`
    })
  }
}
</script>
<style scoped lang="stylus">
  .singer
    /* better-scroll父容器 */
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
