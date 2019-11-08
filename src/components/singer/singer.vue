<template>
  <div id="singerPage" class="singer">
    <Listview v-bind:data="singers"></Listview>
  </div>
</template>
<script>
import { getSingerList } from 'api/singer'
import { ERROR_OK } from 'api/config'
import Listview from 'base/listview/listview'
import Singer from 'common/js/singer'
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
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERROR_OK) {
          this.singers = this.normalizeSingers(res.data.list || [])
          console.log(Object.prototype.toString.call(this.singers) === '[object Array]')
        }
      })
    },
    normalizeSingers(list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
        }
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
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
    }
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