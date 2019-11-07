<template>
  <div id="singerPage" class="singer">
    <Listview :data="singers"></Listview>
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
      singers: {
        type: Array,
        default: () => {
          return []
        }
      }
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
      console.log(typeof (map), map)
      /* 数据排序,展示有序列表 */

      let hot = [] /* 热门 */
      let letter = [] /* 字母 */
      let other = [] /* 其他字符 */
      for (let val of map) {
        /* if (val.title.match(/[A-Za-z]/)) {
          letter.push(val)
        } else if (val.title === HOT_TITLE) {
          hot.push(val)
        } else {
          other.push(val)
        } */
      }
      return map
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